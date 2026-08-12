import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getAllTickets,
  getTicketByIdOrCode,
} from "@/lib/services/ticketService";
import { sendTicketEmail } from "@/lib/services/emailService";
import { generateTicketPDF, saveTicketPDFToStorage } from "@/lib/services/pdfService";

export async function GET() {
  try {
    const tickets = await getAllTickets();
    return NextResponse.json({ tickets, success: true });
  } catch (error: any) {
    console.error("[Admin Tickets API GET Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao buscar ingressos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ticketId } = body;

    if (!ticketId || !action) {
      return NextResponse.json(
        { error: "ticketId e action são obrigatórios" },
        { status: 400 }
      );
    }

    const ticket = await getTicketByIdOrCode(ticketId);

    if (!ticket) {
      return NextResponse.json(
        { error: `Ingresso ${ticketId} não localizado.` },
        { status: 404 }
      );
    }

    // AÇÃO 1: REENVIAR INGRESSO POR E-MAIL VIA RESEND
    if (action === "resend_email") {
      console.log(`[Admin Action]: Reenviando e-mail para o ingresso ${ticket.ticket_code}`);

      let pdfBuffer: Buffer | undefined;
      try {
        pdfBuffer = await generateTicketPDF({
          ticketCode: ticket.ticket_code,
          qrToken: ticket.qr_token,
          customerName: ticket.customer_name || "Participante",
          customerCpf: ticket.customer_cpf || "",
          lotName: ticket.lot_name || "Imersão Método Maestro",
        });
      } catch (pdfErr) {
        console.warn("[Admin Resend PDF Warning]:", pdfErr);
      }

      const emailRes = await sendTicketEmail({
        customerName: ticket.customer_name || "Participante",
        customerEmail: ticket.customer_email || "",
        ticketCode: ticket.ticket_code,
        qrToken: ticket.qr_token,
        lotName: ticket.lot_name || "Imersão Método Maestro",
        pdfBuffer,
        pdfUrl: ticket.pdf_url,
      });

      if (emailRes.success) {
        const nowIso = new Date().toISOString();
        ticket.email_sent = true;
        ticket.email_sent_at = nowIso;

        if (isSupabaseConfigured) {
          await supabaseAdmin
            .from("tickets")
            .update({
              email_sent: true,
              email_sent_at: nowIso,
              updated_at: nowIso,
            })
            .eq("id", ticket.id);
        }

        console.log(`[ticket_resent]: Reenvio com sucesso para ${ticket.customer_email}`);

        return NextResponse.json({
          success: true,
          message: `E-mail reenviado com sucesso para ${ticket.customer_email}!`,
          email_sent_at: nowIso,
        });
      } else {
        return NextResponse.json(
          { error: emailRes.error || "Falha ao disparar e-mail via Resend." },
          { status: 500 }
        );
      }
    }

    // AÇÃO 2: CANCELAR INGRESSO
    if (action === "cancel_ticket") {
      ticket.status = "CANCELLED";

      if (isSupabaseConfigured) {
        await supabaseAdmin
          .from("tickets")
          .update({
            status: "CANCELLED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", ticket.id);
      }

      console.log(`[ticket_cancelled]: Ingresso ${ticket.ticket_code} cancelado pelo admin.`);

      return NextResponse.json({
        success: true,
        message: `Ingresso ${ticket.ticket_code} foi cancelado com sucesso.`,
      });
    }

    // AÇÃO 3: MARCAR / CONFIRMAR CHECK-IN MANUALMENTE
    if (action === "do_checkin") {
      const nowIso = new Date().toISOString();
      ticket.status = "USED";
      ticket.checked_in = true;
      ticket.checked_in_at = nowIso;

      if (isSupabaseConfigured) {
        await supabaseAdmin
          .from("tickets")
          .update({
            status: "USED",
            checked_in: true,
            checked_in_at: nowIso,
            updated_at: nowIso,
          })
          .eq("id", ticket.id);
      }

      console.log(`[ticket_checked_in]: Check-in manual realizado para ${ticket.ticket_code}`);

      return NextResponse.json({
        success: true,
        message: `Check-in confirmado para ${ticket.customer_name}!`,
        checked_in_at: nowIso,
      });
    }

    return NextResponse.json({ error: "Ação não suportada." }, { status: 400 });
  } catch (error: any) {
    console.error("[Admin Tickets POST Exception]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao processar ação no ingresso." },
      { status: 500 }
    );
  }
}
