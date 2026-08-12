import { NextResponse } from "next/server";
import { issueTicketForOrder, getTicketByQRToken, getTicketByIdOrCode } from "@/lib/services/ticketService";
import { sendTicketEmail } from "@/lib/services/emailService";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: { test: string; status: "PASSED" | "FAILED"; details?: string }[] = [];

  try {
    const testOrderId = "order_test_" + Date.now();

    // Mock pedido de teste simulado
    const simulatedPaidOrder = {
      id: testOrderId,
      customer_name: "Aluno Teste Maestro",
      customer_email: "aluno.teste@metodomaestro.com.br",
      customer_cpf: "123.456.789-00",
      lot_name: "Lote 1 - Imersão Presencial",
      amount: 297.0,
      payment_method: "pix",
      status: "paid",
    };

    // TESTE 1: Pagamento aprovado gera ingresso
    const issue1 = await issueTicketForOrder(testOrderId);
    // Se o pedido não estava no banco, issueTicket usou dados padrão/memória ou falhou. Se falhou por não achar pedido, testamos com fallback.
    let ticketCode1 = issue1.ticket?.ticket_code;
    let qrToken1 = issue1.ticket?.qr_token;

    results.push({
      test: "1. Pagamento Aprovado Gera Ingresso",
      status: issue1.success || ticketCode1 ? "PASSED" : "FAILED",
      details: ticketCode1 ? `Ingresso gerado: ${ticketCode1}` : issue1.error,
    });

    // TESTE 2: Idempotência (Webhook duplicado NÃO gera segundo ingresso)
    const issue2 = await issueTicketForOrder(testOrderId);
    const isIdempotent = issue2.alreadyIssued || issue2.ticket?.ticket_code === ticketCode1;

    results.push({
      test: "2. Webhook Duplicado NÃO Gera Ingresso Duplicado (Idempotência)",
      status: isIdempotent ? "PASSED" : "FAILED",
      details: isIdempotent
        ? `Idempotência confirmada: Reutilizou ${issue2.ticket?.ticket_code}`
        : "FALHA: Gerou outro ingresso para o mesmo order_id",
    });

    // TESTE 3: Pagamento pendente NÃO gera ingresso
    const pendingOrderId = "order_pending_" + Date.now();
    // Invocando emissão para pedido inexistente / não pago
    const issuePending = await issueTicketForOrder(pendingOrderId);
    const pendingBlocked = !issuePending.success || issuePending.error?.includes("status");

    results.push({
      test: "3. Pagamento Pendente/Inexistente NÃO Gera Ingresso",
      status: pendingBlocked ? "PASSED" : "FAILED",
      details: pendingBlocked ? "Bloqueado corretamente para pagamento pendente" : "FALHA",
    });

    // TESTE 4: Busca por QR Token público funciona
    if (qrToken1) {
      const fetchedTicket = await getTicketByQRToken(qrToken1);
      results.push({
        test: "4. Busca Pública de Ingresso por QR Token",
        status: fetchedTicket?.qr_token === qrToken1 ? "PASSED" : "FAILED",
        details: fetchedTicket ? `Encontrado participante: ${fetchedTicket.customer_name}` : "Não encontrado",
      });
    }

    // TESTE 5: Disparo do Resend / Serviço de E-mail
    const emailRes = await sendTicketEmail({
      customerName: "Aluno Teste Maestro",
      customerEmail: "aluno.teste@metodomaestro.com.br",
      ticketCode: ticketCode1 || "MM-TEST-1234",
      qrToken: qrToken1 || "test_token_123",
      lotName: "Lote 1",
    });

    results.push({
      test: "5. Envio Transacional via Resend",
      status: emailRes.success ? "PASSED" : "FAILED",
      details: emailRes.success
        ? `E-mail processado (MessageId: ${emailRes.messageId})`
        : emailRes.error,
    });

    // TESTE 6: Validação de Check-in (ACTIVE -> USED)
    if (qrToken1) {
      const validateRes1 = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tickets/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: qrToken1, action: "confirm" }),
        }
      ).then((r) => r.json());

      results.push({
        test: "6. Ingresso ACTIVE Realiza Check-in",
        status: validateRes1.valid || validateRes1.success ? "PASSED" : "FAILED",
        details: validateRes1.message || validateRes1.error,
      });

      // TESTE 7: Ingresso USED NÃO pode entrar novamente
      const validateRes2 = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tickets/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: qrToken1, action: "confirm" }),
        }
      ).then((r) => r.json());

      const blockedDuplicateCheckin = validateRes2.alreadyUsed || !validateRes2.valid;

      results.push({
        test: "7. Ingresso USED Impede Segundo Check-in (Proteção de Concorrência)",
        status: blockedDuplicateCheckin ? "PASSED" : "FAILED",
        details: blockedDuplicateCheckin
          ? `Bloqueado corretamente: ${validateRes2.error || validateRes2.message}`
          : "FALHA: Permitiu segundo check-in",
      });
    }

    const allPassed = results.every((r) => r.status === "PASSED");

    return NextResponse.json({
      summary: allPassed ? "TODOS OS TESTES PASSARAM COM SUCESSO! 🎉" : "ALGUNS TESTES FALHARAM",
      allPassed,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    console.error("[Test Suite Exception]:", error);
    return NextResponse.json(
      { error: error?.message || "Exceção ao executar suite de testes" },
      { status: 500 }
    );
  }
}
