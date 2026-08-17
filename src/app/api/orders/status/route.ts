import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getPaymentDetails } from "@/lib/mercadopago";
import { issueTicketForOrder } from "@/lib/services/ticketService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    const gatewayId = url.searchParams.get("gatewayId");
    const isLatest = url.searchParams.get("latest") === "true";

    if (!orderId && !gatewayId && !isLatest) {
      return NextResponse.json(
        { error: "orderId, gatewayId ou latest=true são obrigatórios" },
        { status: 400 }
      );
    }

    let order: any = null;

    if (isSupabaseConfigured) {
      let query = supabaseAdmin.from("orders").select("*, tickets(*)");

      if (orderId) {
        query = query.eq("id", orderId);
      } else if (gatewayId) {
        query = query.eq("gateway_payment_id", gatewayId);
      } else if (isLatest) {
        query = query.eq("status", "paid").order("created_at", { ascending: false }).limit(1);
      }

      const { data } = await query.maybeSingle();
      if (data) {
        order = data;
      }
    }

    if (!order) {
      // Fallback em memória via API de ordens
      try {
        const adminRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/orders`
        );
        const adminData = await adminRes.json();
        if (adminData?.orders) {
          order = adminData.orders.find(
            (o: any) => o.id === orderId || o.gateway_payment_id === gatewayId
          );
        }
      } catch (e) {
        console.warn("[Order Status Fetch Error]:", e);
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não localizado" },
        { status: 404 }
      );
    }

    // VERIFICAÇÃO AUTOMÁTICA EM TEMPO REAL NO MERCADO PAGO SE O PEDIDO AINDA CONSTAR COMO PENDENTE
    if (order.status !== "paid" && order.status !== "approved") {
      try {
        let mpDetails = await getPaymentDetails(order.gateway_payment_id || order.id);

        if (!mpDetails.isApproved && order.id) {
          const searchRes = await getPaymentDetails(order.id);
          if (searchRes.isApproved) {
            mpDetails = searchRes;
          }
        }

        if (mpDetails.isApproved || mpDetails.status === "approved") {
          console.log(`[AutoVerify Order Paid]: Pedido ${order.id} aprovado via MP API.`);
          const nowIso = new Date().toISOString();
          order.status = "paid";
          order.paid_at = nowIso;

          if (isSupabaseConfigured) {
            const updatePayload: any = { status: "paid", paid_at: nowIso };
            if (mpDetails.id) {
              updatePayload.gateway_payment_id = mpDetails.id;
            }

            await supabaseAdmin
              .from("orders")
              .update(updatePayload)
              .eq("id", order.id);
          }

          // Disparar emissão do ingresso e e-mail
          await issueTicketForOrder(order.id);
        }
      } catch (mpErr) {
        console.warn("[AutoVerify MP Warning]:", mpErr);
      }
    }

    // Buscar ticket associado se houver
    let ticket: any = null;
    if (order.tickets && Array.isArray(order.tickets) && order.tickets.length > 0) {
      ticket = order.tickets[0];
    } else if (order.tickets && typeof order.tickets === "object") {
      ticket = order.tickets;
    }

    if (!ticket && isSupabaseConfigured) {
      const { data: tktData } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("order_id", order.id)
        .maybeSingle();

      if (tktData) {
        ticket = tktData;
      }
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      amount: order.amount,
      lotName: order.lot_name,
      turma: order.turma || "turma_1",
      isPaid: order.status === "paid" || order.status === "approved",
      ticket: ticket
        ? {
            ticket_code: ticket.ticket_code,
            qr_token: ticket.qr_token,
            pdf_url: ticket.pdf_url,
            status: ticket.status,
          }
        : null,
    });
  } catch (error: any) {
    console.error("[Order Status API Exception]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao buscar pedido" },
      { status: 500 }
    );
  }
}
