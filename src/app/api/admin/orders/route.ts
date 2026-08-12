import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { issueTicketForOrder } from "@/lib/services/ticketService";
import { getPaymentDetails } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

let IN_MEMORY_ORDERS: any[] = [];

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Auto-verificar pedidos pendentes no Mercado Pago
      const updatedOrders = await Promise.all(
        data.map(async (order) => {
          if (
            (order.status === "pending" || order.status === "in_process") &&
            order.gateway_payment_id
          ) {
            try {
              const mpDetails = await getPaymentDetails(order.gateway_payment_id);
              if (mpDetails.isApproved || mpDetails.status === "approved") {
                const nowIso = new Date().toISOString();
                await supabaseAdmin
                  .from("orders")
                  .update({ status: "paid", paid_at: nowIso })
                  .eq("id", order.id);

                await issueTicketForOrder(order.id);
                return { ...order, status: "paid", paid_at: nowIso };
              }
            } catch (e) {
              console.warn(`[Admin AutoVerify Warning]: Order ${order.id}:`, e);
            }
          }
          return order;
        })
      );

      IN_MEMORY_ORDERS = updatedOrders;
      return NextResponse.json({ orders: updatedOrders, source: "supabase" });
    }
  } catch (error: any) {
    console.warn("[GET Orders Supabase Warning]:", error?.message);
  }

  return NextResponse.json({ orders: IN_MEMORY_ORDERS, source: "memory" });
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId e status são obrigatórios" },
        { status: 400 }
      );
    }

    IN_MEMORY_ORDERS = IN_MEMORY_ORDERS.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            paid_at: status === "paid" ? new Date().toISOString() : o.paid_at,
          }
        : o
    );

    try {
      const updatePayload: any = { status };
      if (status === "paid") {
        updatePayload.paid_at = new Date().toISOString();
      }
      await supabaseAdmin.from("orders").update(updatePayload).eq("id", orderId);
    } catch (e) {
      console.warn("[Update Order Supabase Warning]:", e);
    }

    let ticketResult = null;
    if (status === "paid") {
      ticketResult = await issueTicketForOrder(orderId);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status,
      ticketIssued: ticketResult?.success,
      ticketCode: ticketResult?.ticket?.ticket_code,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
