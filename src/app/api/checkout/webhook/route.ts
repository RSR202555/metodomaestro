import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getPaymentDetails } from "@/lib/mercadopago";
import { issueTicketForOrder } from "@/lib/services/ticketService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // Obter ID do pagamento enviado pelo Mercado Pago ou parâmetros da URL
    const paymentId =
      body?.data?.id ||
      body?.id ||
      url.searchParams.get("id") ||
      url.searchParams.get("data.id");

    console.log("[Webhook Recebido]:", { paymentId, body });

    if (!paymentId) {
      return NextResponse.json({ received: true, note: "Sem ID de pagamento no payload" });
    }

    // 1. CONSULTAR MERCADO PAGO PARA OBTER STATUS REAL E VERIFICADO
    const mpDetails = await getPaymentDetails(paymentId);

    console.log("[Webhook MP Status Verificado]:", {
      paymentId,
      status: mpDetails.status,
      isApproved: mpDetails.isApproved,
      payerEmail: mpDetails.payerEmail,
      externalReference: mpDetails.externalReference,
    });

    let orderId: string | null = null;
    let targetOrder: any = null;

    // 2. LOCALIZAR O PEDIDO CORRESPONDENTE NO SUPABASE COM 3 ESTRATÉGIAS DE MATCH
    if (isSupabaseConfigured) {
      // Estratégia A: Buscar por gateway_payment_id
      const { data: byGateway } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("gateway_payment_id", String(paymentId))
        .maybeSingle();

      targetOrder = byGateway;

      // Estratégia B: Buscar por externalReference (ID do pedido salvo na preferência)
      if (!targetOrder && mpDetails.externalReference) {
        const extStr = String(mpDetails.externalReference).trim();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(extStr);
        if (isUuid) {
          const { data: byExt } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", extStr)
            .maybeSingle();

          targetOrder = byExt;
        }
      }

      // Estratégia C: Buscar pelo e-mail do comprador se ainda estiver pendente
      if (!targetOrder && mpDetails.payerEmail) {
        const { data: byEmail } = await supabaseAdmin
          .from("orders")
          .select("*")
          .eq("customer_email", mpDetails.payerEmail)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        targetOrder = byEmail;
      }

      if (targetOrder) {
        orderId = targetOrder.id;

        // 3. ATUALIZAR STATUS E ID DE PAGAMENTO DO PEDIDO
        if (mpDetails.isApproved || mpDetails.status === "approved") {
          await supabaseAdmin
            .from("orders")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              gateway_payment_id: String(paymentId),
            })
            .eq("id", orderId);
        } else if (mpDetails.status === "rejected" || mpDetails.status === "cancelled") {
          await supabaseAdmin
            .from("orders")
            .update({ status: "cancelled" })
            .eq("id", orderId);
        }
      }
    }

    // 4. SE O PAGAMENTO ESTIVER APROVADO, DISPARAR EMISSÃO IDEMPOTENTE DO INGRESSO
    if (mpDetails.isApproved || mpDetails.status === "approved") {
      if (orderId) {
        const ticketResult = await issueTicketForOrder(orderId);
        console.log("[Webhook IssueTicket Result]:", ticketResult);
        return NextResponse.json({
          received: true,
          status: "paid",
          ticketIssued: ticketResult.success,
          ticketCode: ticketResult.ticket?.ticket_code,
        });
      }
    }

    return NextResponse.json({ received: true, status: mpDetails.status, matchedOrder: orderId });
  } catch (error: any) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const action = url.searchParams.get("action");

  // ROTA DE SIMULAÇÃO PARA TESTES LOCAIS E HOMOLOGAÇÃO
  if (orderId && action === "simulate_pay") {
    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
      }
    }

    // Disparar emissão de ingresso
    const ticketResult = await issueTicketForOrder(orderId);

    return NextResponse.json({
      success: true,
      message: "Pedido atualizado para Pago com sucesso!",
      ticketIssued: ticketResult.success,
      ticketCode: ticketResult.ticket?.ticket_code,
      qrToken: ticketResult.ticket?.qr_token,
      ticket: ticketResult.ticket,
    });
  }

  return NextResponse.json({ status: "Webhook endpoint ativo e operacional" });
}
