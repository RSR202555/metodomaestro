import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { generateTicketPDF, saveTicketPDFToStorage } from "./pdfService";
import { sendTicketEmail } from "./emailService";

export interface TicketRecord {
  id: string;
  order_id: string;
  customer_id?: string | null;
  ticket_code: string;
  qr_token: string;
  ticket_type: string;
  lot_id?: string | null;
  status: "ACTIVE" | "USED" | "CANCELLED" | "REFUNDED";
  checked_in: boolean;
  checked_in_at?: string | null;
  issued_at: string;
  email_sent: boolean;
  email_sent_at?: string | null;
  pdf_url?: string | null;
  customer_name?: string;
  customer_email?: string;
  customer_cpf?: string;
  lot_name?: string;
  turma?: string | null;
  created_at: string;
  updated_at: string;
}

// CACHE EM MEMÓRIA PARA AMBIENTES SEM SUPABASE OU PARA FALLBACK
let IN_MEMORY_TICKETS: TicketRecord[] = [];

/**
 * Gera um código legível único no formato MM-XXXX-YYYY-ZZZZ
 */
function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (len: number) =>
    Array.from(crypto.randomBytes(len))
      .map((b) => chars[b % chars.length])
      .join("");
  return `MM-${part(4)}-${part(4)}-${part(4)}`;
}

/**
 * Gera um token aleatório e criptograficamente seguro para a URL do QR Code
 */
function generateQRToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * SERVIÇO PRINCIPAL E IDEMPOTENTE DE EMISSÃO DE INGRESSOS.
 * Pode ser chamado com segurança pelo Webhook do Mercado Pago, Simulação ou Painel Admin.
 */
export async function issueTicketForOrder(orderId: string): Promise<{
  success: boolean;
  ticket?: TicketRecord;
  alreadyIssued?: boolean;
  error?: string;
}> {
  console.log(`[TicketService]: Iniciando processo de emissão para o Pedido: ${orderId}`);

  try {
    // 1. VERIFICAR SE O INGRESSO JÁ FOI EMITIDO (IDEMPOTÊNCIA)
    let existingTicket: TicketRecord | null = null;

    if (isSupabaseConfigured) {
      const { data } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();

      if (data) {
        existingTicket = data as TicketRecord;
      }
    } else {
      existingTicket =
        IN_MEMORY_TICKETS.find((t) => t.order_id === orderId) || null;
    }

    // Se já existir o ingresso no banco/memória
    if (existingTicket) {
      console.log(`[TicketService Idempotency]: Ingresso já existente (${existingTicket.ticket_code}) para o pedido ${orderId}`);

      // Se o e-mail ainda não foi enviado com sucesso, tentar enviar agora
      if (!existingTicket.email_sent) {
        console.log(`[TicketService Retry Email]: Tentando enviar e-mail pendente para ingresso ${existingTicket.ticket_code}`);
        await sendEmailForTicket(existingTicket);
      }

      return {
        success: true,
        ticket: existingTicket,
        alreadyIssued: true,
      };
    }

    // 2. BUSCAR DADOS DO PEDIDO NO SUPABASE OU MEMÓRIA
    let order: any = null;

    if (isSupabaseConfigured) {
      const { data: dbOrder, error: orderErr } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!orderErr && dbOrder) {
        order = dbOrder;
      }
    }

    if (!order) {
      // Se não encontrou no DB, tentar buscar via API Admin (que pode ter em memória)
      try {
        const fetchRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/orders`
        );
        const adminData = await fetchRes.json();
        if (adminData?.orders) {
          order = adminData.orders.find((o: any) => o.id === orderId);
        }
      } catch (e) {
        console.warn("[TicketService Order Fetch Warning]:", e);
      }
    }

    if (!order) {
      console.error(`[TicketService Error]: Pedido ${orderId} não encontrado.`);
      return { success: false, error: `Pedido ${orderId} não foi localizado.` };
    }

    // 3. VALIDAR SE O PAGAMENTO ESTÁ APROVADO
    if (order.status !== "paid" && order.status !== "approved") {
      console.warn(`[TicketService Warning]: Pagamento não aprovado para pedido ${orderId}. Status atual: ${order.status}`);
      return {
        success: false,
        error: `O pagamento do pedido está com status '${order.status}'. Ingresso só é emitido para pagamentos confirmados.`,
      };
    }

    // 4. GERAR CÓDIGOS ÚNICOS E TOKEN SEGURO
    const ticketCode = generateTicketCode();
    const qrToken = generateQRToken();
    const nowIso = new Date().toISOString();

    const customerName = order.customer_name || "Participante";
    const customerEmail = order.customer_email || "";
    const customerCpf = order.customer_cpf || "";
    const lotName = order.lot_name || "Ingresso Método Maestro - Lote VIP";
    const turma = order.turma || "turma_1";
    const eventDateText = turma === "turma_2" ? "26 e 27 de Setembro" : "12 e 13 de Setembro";

    // 5. GERAR PDF DO INGRESSO
    let pdfBuffer: Buffer | undefined;
    let pdfUrl: string | null = null;

    try {
      pdfBuffer = await generateTicketPDF({
        ticketCode,
        qrToken,
        customerName,
        customerCpf,
        lotName,
        eventDate: `${eventDateText} (Sáb 16h30 | Dom 15h30)`,
      });

      // Tentar salvar PDF no Supabase Storage
      if (pdfBuffer) {
        pdfUrl = await saveTicketPDFToStorage(pdfBuffer, ticketCode);
      }
    } catch (pdfErr) {
      console.error("[TicketService PDF Generation Failed]:", pdfErr);
      // Não abortar a criação do ingresso se a geração de PDF falhar
    }

    // 6. SALVAR REGISTRO DO INGRESSO NO BANCO DE DADOS
    const generatedId = "tkt_" + Math.random().toString(36).substring(2, 10);
    const newTicketData: TicketRecord = {
      id: generatedId,
      order_id: orderId,
      customer_id: order.user_id || null,
      ticket_code: ticketCode,
      qr_token: qrToken,
      ticket_type: "VIP",
      lot_id: order.lot_id || null,
      status: "ACTIVE",
      checked_in: false,
      checked_in_at: null,
      issued_at: nowIso,
      email_sent: false,
      email_sent_at: null,
      pdf_url: pdfUrl,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_cpf: customerCpf,
      lot_name: lotName,
      turma: turma,
      created_at: nowIso,
      updated_at: nowIso,
    };

    let createdTicket: TicketRecord = newTicketData;

    if (isSupabaseConfigured) {
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from("tickets")
        .insert({
          order_id: orderId,
          customer_id: order.user_id || null,
          ticket_code: ticketCode,
          qr_token: qrToken,
          ticket_type: "VIP",
          lot_id: order.lot_id || null,
          status: "ACTIVE",
          checked_in: false,
          issued_at: nowIso,
          email_sent: false,
          pdf_url: pdfUrl,
          turma: turma,
        })
        .select("*")
        .single();

      if (insertErr) {
        console.error("[TicketService DB Insert Error]:", insertErr);
      } else if (inserted) {
        createdTicket = {
          ...inserted,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_cpf: customerCpf,
          lot_name: lotName,
        };
      }
    }

    // Adicionar ao cache em memória
    IN_MEMORY_TICKETS.push(createdTicket);

    console.log(`[TicketCreated Success]: Ticket ${createdTicket.ticket_code} gerado com sucesso.`);

    // 7. ENVIAR E-MAIL TRANSACIONAL VIA RESEND
    await sendEmailForTicket(createdTicket, pdfBuffer, customerEmail, customerName, lotName);

    return {
      success: true,
      ticket: createdTicket,
      alreadyIssued: false,
    };
  } catch (error: any) {
    console.error("[TicketService Exception]:", error);
    return {
      success: false,
      error: error?.message || "Exceção não tratada ao emitir ingresso.",
    };
  }
}

/**
 * Função auxiliar para envio de e-mail e atualização de status no banco de dados.
 */
async function sendEmailForTicket(
  ticket: TicketRecord,
  pdfBuffer?: Buffer,
  emailOverride?: string,
  nameOverride?: string,
  lotOverride?: string
): Promise<boolean> {
  const targetEmail = emailOverride || ticket.customer_email;
  const targetName = nameOverride || ticket.customer_name || "Participante";
  const targetLot = lotOverride || ticket.lot_name || "Imersão Método Maestro";
  const targetTurma = ticket.turma || "turma_1";
  const eventDateText = targetTurma === "turma_2" ? "26 e 27 de Setembro" : "12 e 13 de Setembro";

  if (!targetEmail) {
    console.warn("[TicketService Email Warning]: E-mail do cliente não informado.");
    return false;
  }

  const emailResult = await sendTicketEmail({
    customerName: targetName,
    customerEmail: targetEmail,
    ticketCode: ticket.ticket_code,
    qrToken: ticket.qr_token,
    lotName: targetLot,
    eventDate: `${eventDateText} (Sáb 16h30 | Dom 15h30)`,
    pdfBuffer,
    pdfUrl: ticket.pdf_url,
  });

  if (emailResult.success) {
    const nowIso = new Date().toISOString();
    ticket.email_sent = true;
    ticket.email_sent_at = nowIso;

    if (isSupabaseConfigured) {
      await supabaseAdmin
        .from("tickets")
        .update({
          email_sent: true,
          email_sent_at: nowIso,
        })
        .eq("id", ticket.id);
    }
    console.log(`[EmailSent Success]: E-mail do ingresso ${ticket.ticket_code} enviado para ${targetEmail}`);
    return true;
  } else {
    console.error(`[EmailFailed]: Erro ao enviar e-mail para ${targetEmail}: ${emailResult.error}`);
    return false;
  }
}

/**
 * Busca um ingresso pelo qr_token público
 */
export async function getTicketByQRToken(qrToken: string): Promise<TicketRecord | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select("*, orders(customer_name, customer_email, customer_cpf, lot_name, turma)")
      .eq("qr_token", qrToken)
      .maybeSingle();

    if (!error && data) {
      const orderInfo = (data as any).orders || {};
      return {
        ...data,
        customer_name: orderInfo.customer_name || "Participante",
        customer_email: orderInfo.customer_email || "",
        customer_cpf: orderInfo.customer_cpf || "",
        lot_name: orderInfo.lot_name || "Imersão Método Maestro",
        turma: data.turma || orderInfo.turma || "turma_1",
      } as TicketRecord;
    }
  }

  const memoryMatch = IN_MEMORY_TICKETS.find((t) => t.qr_token === qrToken);
  return memoryMatch || null;
}

/**
 * Busca um ingresso pelo ID ou ticket_code
 */
export async function getTicketByIdOrCode(identifier: string): Promise<TicketRecord | null> {
  if (isSupabaseConfigured) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let query = supabaseAdmin
      .from("tickets")
      .select("*, orders(customer_name, customer_email, customer_cpf, lot_name, turma)");

    if (isUuid) {
      query = query.or(`id.eq.${identifier},ticket_code.eq.${identifier}`);
    } else {
      query = query.eq("ticket_code", identifier);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      const orderInfo = (data as any).orders || {};
      return {
        ...data,
        customer_name: orderInfo.customer_name || "Participante",
        customer_email: orderInfo.customer_email || "",
        customer_cpf: orderInfo.customer_cpf || "",
        lot_name: orderInfo.lot_name || "Imersão Método Maestro",
        turma: data.turma || orderInfo.turma || "turma_1",
      } as TicketRecord;
    }
  }

  return (
    IN_MEMORY_TICKETS.find(
      (t) => t.id === identifier || t.ticket_code === identifier
    ) || null
  );
}

/**
 * Retorna todos os ingressos emitidos
 */
export async function getAllTickets(): Promise<TicketRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select("*, orders(customer_name, customer_email, customer_cpf, lot_name, turma)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((t: any) => ({
        ...t,
        customer_name: t.orders?.customer_name || "Participante",
        customer_email: t.orders?.customer_email || "",
        customer_cpf: t.orders?.customer_cpf || "",
        lot_name: t.orders?.lot_name || "Imersão Método Maestro",
        turma: t.turma || t.orders?.turma || "turma_1",
      })) as TicketRecord[];
    }
  }

  return IN_MEMORY_TICKETS;
}
