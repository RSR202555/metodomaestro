import { Resend } from "resend";

export interface SendTicketEmailParams {
  customerName: string;
  customerEmail: string;
  ticketCode: string;
  qrToken: string;
  lotName: string;
  eventDate?: string;
  eventLocation?: string;
  pdfBuffer?: Buffer;
  pdfUrl?: string | null;
}

/**
 * Envia o e-mail transacional do ingresso para o participante utilizando o Resend.
 * Executa EXCLUSIVAMENTE no servidor (Server Components / API Routes).
 */
export async function sendTicketEmail(params: SendTicketEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Método Maestro <ingressos@metodomaestro.com.br>";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const {
    customerName,
    customerEmail,
    ticketCode,
    qrToken,
    lotName,
    eventDate = "5 e 6 de Setembro de 2026",
    eventLocation = "World Gym Pro (Salvador - BA)",
    pdfBuffer,
    pdfUrl,
  } = params;

  const onlineTicketUrl = `${baseUrl}/ingresso/${qrToken}`;
  const downloadPdfUrl = pdfUrl || onlineTicketUrl;

  console.log(`[Resend Email Service]: Preparando envio para ${customerEmail} (Ingresso: ${ticketCode})`);

  // Se a API Key não estiver configurada no ambiente local, simular envio com sucesso e registrar log
  if (!apiKey || apiKey.includes("placeholder") || apiKey === "") {
    console.warn(
      `[Resend Warning]: RESEND_API_KEY não configurada no ambiente. E-mail simulado para ${customerEmail}.`
    );
    return {
      success: true,
      messageId: "simulated_msg_" + Date.now(),
    };
  }

  try {
    const resend = new Resend(apiKey);

    // Template HTML responsivo e de altíssimo padrão (Método Maestro Dark & Gold - Alta Legibilidade e Organização)
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seu Ingresso Método Maestro</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background-color: #0d0d0d; color: #ffffff; margin: 0; padding: 20px 10px; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0d;">
        <tr>
          <td align="center">
            
            <!-- MAIN CONTAINER -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #181818; border: 2px solid #d4af37; border-radius: 20px; padding: 32px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              
              <!-- HEADER -->
              <tr>
                <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #2d2d2d;">
                  <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #f3cb46, #d4af37); border-radius: 16px; color: #000000; font-weight: 900; font-size: 30px; line-height: 56px; text-align: center; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">M</div>
                  <h1 style="color: #f3cb46; font-size: 26px; font-weight: 900; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 2px;">MÉTODO MAESTRO</h1>
                  <p style="color: #cccccc; font-size: 13px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Imersão Presencial • Filipe Aquino</p>
                </td>
              </tr>

              <!-- INTRO -->
              <tr>
                <td style="padding: 24px 0 16px 0;">
                  <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0;">Olá, ${customerName}! 👋</h2>
                  <p style="color: #e0e0e0; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                    Sua inscrição no <strong style="color: #f3cb46;">Método Maestro</strong> foi confirmada! Sua vaga para a Imersão Presencial está garantida.
                  </p>
                </td>
              </tr>

              <!-- CARTÃO DE INGRESSO (ORGANIZADO & HIGH CONTRAST) -->
              <tr>
                <td>
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #222222; border: 1.5px solid #d4af37; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
                    
                    <!-- BANNER DO CARD -->
                    <tr>
                      <td align="center" style="background: linear-gradient(90deg, #2a220e, #3a2e12, #2a220e); padding: 14px 20px; border-bottom: 1px solid #4a3b18;">
                        <span style="color: #f3cb46; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;">
                          🎟️ CREDENCIAL OFICIAL DE ACESSO
                        </span>
                      </td>
                    </tr>

                    <!-- CORPO DO CARD COM DADOS AGRUPADOS -->
                    <tr>
                      <td style="padding: 20px;">
                        
                        <!-- BLOCO 1: PARTICIPANTE -->
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                          <tr>
                            <td style="padding-bottom: 4px;">
                              <span style="color: #a0a0a0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block;">PARTICIPANTE</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: 0.5px;">${customerName}</span>
                            </td>
                          </tr>
                        </table>

                        <div style="border-bottom: 1px solid #333333; margin-bottom: 16px;"></div>

                        <!-- BLOCO 2: CÓDIGO E LOTE (LADO A LADO ORGANIZADO) -->
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                          <tr>
                            <td width="50%" valign="top" style="padding-right: 10px;">
                              <span style="color: #a0a0a0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">CÓDIGO DO INGRESSO</span>
                              <span style="color: #f3cb46; font-size: 15px; font-weight: 900; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;">${ticketCode}</span>
                            </td>
                            <td width="50%" valign="top" style="padding-left: 10px;">
                              <span style="color: #a0a0a0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">LOTE ADQUIRIDO</span>
                              <span style="color: #ffffff; font-size: 14px; font-weight: 800;">${lotName}</span>
                            </td>
                          </tr>
                        </table>

                        <div style="border-bottom: 1px solid #333333; margin-bottom: 16px;"></div>

                        <!-- BLOCO 3: DATA E LOCAL -->
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="50%" valign="top" style="padding-right: 10px;">
                              <span style="color: #a0a0a0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">DATA & HORÁRIO</span>
                              <span style="color: #ffffff; font-size: 14px; font-weight: 700; line-height: 1.4;">
                                ${eventDate}<br/>
                                <span style="color: #f3cb46; font-size: 12px; font-weight: 800;">Sáb 15h30 / Dom 14h</span>
                              </span>
                            </td>
                            <td width="50%" valign="top" style="padding-left: 10px;">
                              <span style="color: #a0a0a0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">LOCAL DA IMERSÃO</span>
                              <span style="color: #ffffff; font-size: 14px; font-weight: 700; line-height: 1.4;">
                                ${eventLocation}
                              </span>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>

                    <!-- RODAPÉ DO CARD: BADGE DE STATUS -->
                    <tr>
                      <td align="center" style="background-color: #161616; padding: 12px; border-top: 1px solid #333333;">
                        <span style="color: #22c55e; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                          ✓ INGRESSO CONFIRMADO & VÁLIDO
                        </span>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- INSTRUÇÃO DE APRESENTAÇÃO -->
              <tr>
                <td align="center" style="padding: 8px 0 24px 0;">
                  <p style="color: #d0d0d0; font-size: 13px; margin: 0; line-height: 1.5;">
                    Apresente o QR Code na recepção para credenciamento instantâneo.<br/>
                    Seu ingresso em formato PDF também está anexado nesta mensagem.
                  </p>
                </td>
              </tr>

              <!-- BOTÕES DE AÇÃO DESTACADOS -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding: 6px;">
                        <a href="${onlineTicketUrl}" target="_blank" style="background-color: #f3cb46; color: #000000; font-weight: 900; font-size: 13px; text-decoration: none; padding: 15px 28px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 4px 15px rgba(243,203,70,0.3);">
                          ACESSAR MEU INGRESSO ONLINE (QR CODE)
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 6px;">
                        <a href="${downloadPdfUrl}" target="_blank" style="background-color: #2a2a2a; color: #ffffff; border: 1px solid #555555; font-weight: 800; font-size: 12px; text-decoration: none; padding: 12px 24px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                          BAIXAR INGRESSO (PDF)
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding-top: 20px; border-top: 1px solid #2d2d2d;">
                  <p style="margin: 0 0 4px 0; color: #bbbbbb; font-size: 13px;">Nos vemos no Método Maestro!</p>
                  <strong style="color: #f3cb46; font-size: 15px;">Filipe Aquino</strong>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Montar lista de anexos se o buffer do PDF estiver disponível
    const attachments: any[] = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Ingresso-Metodo-Maestro-${ticketCode}.pdf`,
        content: pdfBuffer,
      });
    }

    // Disparar envio de e-mail via SDK oficial do Resend
    const response = await resend.emails.send({
      from: fromEmail,
      to: [customerEmail],
      subject: `🎟️ Seu ingresso para o Método Maestro está confirmado!`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (response.error) {
      console.error("[Resend API Error]:", response.error);
      return {
        success: false,
        error: response.error.message || "Erro retornado pela API Resend",
      };
    }

    console.log(`[Resend Email Success]: E-mail enviado com sucesso. MessageId: ${response.data?.id}`);

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error: any) {
    console.error("[Resend Service Exception]:", error);
    return {
      success: false,
      error: error?.message || "Exceção ao enviar e-mail pelo Resend",
    };
  }
}
