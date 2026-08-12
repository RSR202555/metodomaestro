import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getTicketByQRToken } from "@/lib/services/ticketService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, code, action } = body;

    const targetToken = token || code;

    if (!targetToken) {
      return NextResponse.json(
        { error: "Token ou Código do ingresso não informado." },
        { status: 400 }
      );
    }

    console.log(`[CheckIn API Request]: Token: ${targetToken}, Action: ${action || "lookup"}`);

    // 1. CONSULTAR O ESTADO ATUAL DO INGRESSO
    const ticket = await getTicketByQRToken(targetToken);

    if (!ticket) {
      return NextResponse.json(
        {
          valid: false,
          error: "INGRESSO NÃO ENCONTRADO",
          message: "Este QR Code/Token não corresponde a nenhum ingresso cadastrado no sistema.",
        },
        { status: 404 }
      );
    }

    // 2. SE FOR APENAS CONSULTA (VERIFICAÇÃO SEM CONSUMIR/MARCAR CHECK-IN)
    if (action === "lookup") {
      return NextResponse.json({
        valid: ticket.status === "ACTIVE" && !ticket.checked_in,
        ticket: {
          id: ticket.id,
          ticket_code: ticket.ticket_code,
          qr_token: ticket.qr_token,
          status: ticket.status,
          checked_in: ticket.checked_in,
          checked_in_at: ticket.checked_in_at,
          customer_name: ticket.customer_name,
          customer_email: ticket.customer_email,
          customer_cpf: ticket.customer_cpf,
          lot_name: ticket.lot_name,
        },
      });
    }

    // 3. SE INGRESSO JÁ FOI UTILIZADO
    if (ticket.status === "USED" || ticket.checked_in) {
      return NextResponse.json({
        valid: false,
        alreadyUsed: true,
        error: "INGRESSO JÁ UTILIZADO",
        message: `Este ingresso já realizou credenciamento em ${
          ticket.checked_in_at
            ? new Date(ticket.checked_in_at).toLocaleString("pt-BR")
            : "data anterior"
        }.`,
        ticket: {
          customer_name: ticket.customer_name,
          ticket_code: ticket.ticket_code,
          checked_in_at: ticket.checked_in_at,
        },
      });
    }

    // 4. SE INGRESSO ESTIVER CANCELADO OU REEMBOLSADO
    if (ticket.status === "CANCELLED" || ticket.status === "REFUNDED") {
      return NextResponse.json({
        valid: false,
        cancelled: true,
        error: "INGRESSO CANCELADO",
        message: "Este ingresso foi cancelado ou reembolsado e não permite acesso ao evento.",
        ticket: {
          customer_name: ticket.customer_name,
          ticket_code: ticket.ticket_code,
          status: ticket.status,
        },
      });
    }

    // 5. ATUALIZAÇÃO ATÔMICA CONTRA RACE CONDITIONS (ACTIVE -> USED)
    const nowIso = new Date().toISOString();
    let updateSuccess = false;
    let updatedTicketRecord: any = null;

    if (isSupabaseConfigured) {
      // Executa UPDATE atômico filtrando checked_in = false AND status = 'ACTIVE'
      const { data, error } = await supabaseAdmin
        .from("tickets")
        .update({
          checked_in: true,
          checked_in_at: nowIso,
          status: "USED",
          updated_at: nowIso,
        })
        .eq("id", ticket.id)
        .eq("checked_in", false)
        .eq("status", "ACTIVE")
        .select("*")
        .maybeSingle();

      if (!error && data) {
        updateSuccess = true;
        updatedTicketRecord = data;
      }
    } else {
      // Simulação atômica em memória
      if (ticket.status === "ACTIVE" && !ticket.checked_in) {
        ticket.checked_in = true;
        ticket.checked_in_at = nowIso;
        ticket.status = "USED";
        updateSuccess = true;
        updatedTicketRecord = ticket;
      }
    }

    if (!updateSuccess) {
      return NextResponse.json({
        valid: false,
        alreadyUsed: true,
        error: "CONCORRÊNCIA DE CHECK-IN DETECTADA / INGRESSO JÁ UTILIZADO",
        message: "Este ingresso acabou de ser validado em outro terminal de check-in.",
      });
    }

    console.log(`[CheckIn Success]: Credenciamento confirmado para ${ticket.customer_name} (${ticket.ticket_code})`);

    return NextResponse.json({
      valid: true,
      success: true,
      message: "CHECK-IN REALIZADO COM SUCESSO!",
      ticket: {
        id: updatedTicketRecord.id,
        ticket_code: updatedTicketRecord.ticket_code,
        status: updatedTicketRecord.status,
        checked_in: true,
        checked_in_at: nowIso,
        customer_name: ticket.customer_name,
        customer_email: ticket.customer_email,
        customer_cpf: ticket.customer_cpf,
        lot_name: ticket.lot_name,
      },
    });
  } catch (error: any) {
    console.error("[CheckIn API Exception]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao processar validação de check-in." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || url.searchParams.get("code");

  if (!token) {
    return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
  }

  const ticket = await getTicketByQRToken(token);

  if (!ticket) {
    return NextResponse.json({ valid: false, message: "Ingresso não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    valid: ticket.status === "ACTIVE" && !ticket.checked_in,
    ticket: {
      id: ticket.id,
      ticket_code: ticket.ticket_code,
      status: ticket.status,
      checked_in: ticket.checked_in,
      checked_in_at: ticket.checked_in_at,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      customer_cpf: ticket.customer_cpf,
      lot_name: ticket.lot_name,
    },
  });
}
