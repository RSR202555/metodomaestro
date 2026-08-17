import { NextResponse } from "next/server";
import { getTicketByQRToken } from "@/lib/services/ticketService";
import { generateQRCodeDataUrl } from "@/lib/services/qrService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
    }

    const ticket = await getTicketByQRToken(token);

    if (!ticket) {
      return NextResponse.json({ error: "Ingresso não encontrado" }, { status: 404 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    const publicTicketUrl = `${baseUrl}/ingresso/${ticket.qr_token}`;

    const qrCodeBase64 = await generateQRCodeDataUrl(publicTicketUrl);

    const eventDateText = ticket.turma === "turma_2" ? "26 e 27 de Setembro (Sáb 16h30 | Dom 15h30)" : "12 e 13 de Setembro (Sáb 16h30 | Dom 15h30)";

    return NextResponse.json({
      ticket: {
        ticket_code: ticket.ticket_code,
        qr_token: ticket.qr_token,
        status: ticket.status,
        checked_in: ticket.checked_in,
        checked_in_at: ticket.checked_in_at,
        issued_at: ticket.issued_at,
        pdf_url: ticket.pdf_url,
        customer_name: ticket.customer_name || "Participante",
        lot_name: ticket.lot_name || "Ingresso Método Maestro - Lote VIP",
        turma: ticket.turma || "turma_1",
        event_date: eventDateText,
        event_location: "World Gym Pro (Salvador - BA)",
        qrCodeBase64,
      },
    });
  } catch (error: any) {
    console.error("[Public Ticket API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar ingresso" },
      { status: 500 }
    );
  }
}
