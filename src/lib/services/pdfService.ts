import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateQRCodeBuffer } from "./qrService";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export interface GeneratePDFParams {
  ticketCode: string;
  qrToken: string;
  customerName: string;
  customerCpf: string;
  lotName: string;
  eventDate?: string;
  eventLocation?: string;
}

/**
 * Gera um PDF elegante do ingresso para download e anexo de e-mail.
 * 100% compatível com Vercel Serverless (PDF-Lib em Node.js puro).
 */
export async function generateTicketPDF(params: GeneratePDFParams): Promise<Buffer> {
  const {
    ticketCode,
    qrToken,
    customerName,
    customerCpf,
    lotName,
    eventDate = "5 e 6 de Setembro",
    eventLocation = "World Gym Pro (Salvador - BA)",
  } = params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const publicTicketUrl = `${baseUrl}/ingresso/${qrToken}`;

  // 1. Criar novo Documento PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Formato A4 padrão (pontos)
  const { width, height } = page.getSize();

  // Modos de Cor (Gold, Dark Background, Dark Card)
  const goldColor = rgb(0.83, 0.68, 0.21); // #D4AF37
  const darkBg = rgb(0.04, 0.04, 0.04);    // #0A0A0A
  const cardBg = rgb(0.08, 0.08, 0.08);    // #141414
  const borderGold = rgb(0.5, 0.41, 0.12);
  const white = rgb(1, 1, 1);
  const grayText = rgb(0.65, 0.65, 0.65);
  const lightGray = rgb(0.85, 0.85, 0.85);

  // Carregar Fontes Padrão
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Fundo Principal do PDF
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: darkBg,
  });

  // Borda Externa Dourada Elegante
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: borderGold,
    borderWidth: 1.5,
  });

  // CARD CENTRAL DO INGRESSO
  const cardX = 35;
  const cardY = 35;
  const cardW = width - 70;
  const cardH = height - 70;

  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: cardW,
    height: cardH,
    color: cardBg,
    borderColor: goldColor,
    borderWidth: 1,
  });

  // CABEÇALHO DO INGRESSO
  let currentY = height - 75;

  // Marca / Logo "M"
  page.drawRectangle({
    x: width / 2 - 25,
    y: currentY - 10,
    width: 50,
    height: 50,
    color: goldColor,
  });

  page.drawText("M", {
    x: width / 2 - 10,
    y: currentY + 5,
    size: 32,
    font: fontBold,
    color: darkBg,
  });

  currentY -= 40;

  // TÍTULO DO EVENTO
  const titleText = "MÉTODO MAESTRO";
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 24);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: currentY,
    size: 24,
    font: fontBold,
    color: goldColor,
  });

  currentY -= 20;

  const subtitleText = "IMERSÃO PRESENCIAL COM FILIPE AQUINO";
  const subWidth = fontBold.widthOfTextAtSize(subtitleText, 11);
  page.drawText(subtitleText, {
    x: (width - subWidth) / 2,
    y: currentY,
    size: 11,
    font: fontBold,
    color: white,
  });

  currentY -= 25;

  // Divisória Decorativa
  page.drawLine({
    start: { x: cardX + 30, y: currentY },
    end: { x: cardX + cardW - 30, y: currentY },
    thickness: 1,
    color: borderGold,
  });

  currentY -= 30;

  // BADGE DE STATUS DO INGRESSO
  const badgeText = "INGRESSO VIP CONFIRMADO";
  const badgeWidth = fontBold.widthOfTextAtSize(badgeText, 12);
  const badgeW = badgeWidth + 40;
  const badgeH = 28;
  const badgeX = (width - badgeW) / 2;

  page.drawRectangle({
    x: badgeX,
    y: currentY - 5,
    width: badgeW,
    height: badgeH,
    color: rgb(0.12, 0.25, 0.15),
    borderColor: rgb(0.2, 0.7, 0.3),
    borderWidth: 1,
  });

  page.drawText(badgeText, {
    x: badgeX + 20,
    y: currentY + 3,
    size: 12,
    font: fontBold,
    color: rgb(0.3, 0.9, 0.4),
  });

  currentY -= 45;

  // SEÇÃO 1: DADOS DO PARTICIPANTE
  const secX = cardX + 35;
  
  page.drawText("PARTICIPANTE", {
    x: secX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: goldColor,
  });

  currentY -= 18;

  page.drawText(customerName.toUpperCase(), {
    x: secX,
    y: currentY,
    size: 16,
    font: fontBold,
    color: white,
  });

  currentY -= 18;

  page.drawText(`CPF: ${customerCpf || "Não informado"}`, {
    x: secX,
    y: currentY,
    size: 11,
    font: fontRegular,
    color: grayText,
  });

  currentY -= 25;

  // SEÇÃO 2: DADOS DO INGRESSO E LOTE
  page.drawText("CÓDIGO DO INGRESSO", {
    x: secX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: goldColor,
  });

  page.drawText("LOTE ADQUIRIDO", {
    x: secX + 250,
    y: currentY,
    size: 10,
    font: fontBold,
    color: goldColor,
  });

  currentY -= 18;

  page.drawText(ticketCode, {
    x: secX,
    y: currentY,
    size: 14,
    font: fontBold,
    color: white,
  });

  page.drawText(lotName, {
    x: secX + 250,
    y: currentY,
    size: 12,
    font: fontBold,
    color: lightGray,
  });

  currentY -= 30;

  // SEÇÃO 3: DETALHES DO EVENTO
  page.drawText("DATA & HORÁRIO", {
    x: secX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: goldColor,
  });

  page.drawText("LOCAL DA IMERSÃO", {
    x: secX + 250,
    y: currentY,
    size: 10,
    font: fontBold,
    color: goldColor,
  });

  currentY -= 18;

  page.drawText(`${eventDate} | Sáb 15h30 / Dom 14h`, {
    x: secX,
    y: currentY,
    size: 11,
    font: fontBold,
    color: white,
  });

  page.drawText(eventLocation, {
    x: secX + 250,
    y: currentY,
    size: 11,
    font: fontBold,
    color: white,
  });

  currentY -= 35;

  // Divisória do QR Code
  page.drawLine({
    start: { x: cardX + 30, y: currentY },
    end: { x: cardX + cardW - 30, y: currentY },
    thickness: 1,
    color: borderGold,
  });

  currentY -= 25;

  // SEÇÃO 4: GERAR E EMBUTIR QR CODE
  try {
    const qrBuffer = await generateQRCodeBuffer(publicTicketUrl);
    const qrImage = await pdfDoc.embedPng(qrBuffer);

    const qrSize = 180;
    const qrX = (width - qrSize) / 2;
    const qrY = currentY - qrSize;

    // Moldura Branca para o QR Code destacar no PDF
    page.drawRectangle({
      x: qrX - 8,
      y: qrY - 8,
      width: qrSize + 16,
      height: qrSize + 16,
      color: white,
      borderColor: goldColor,
      borderWidth: 1,
    });

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    currentY = qrY - 25;
  } catch (err) {
    console.error("[PDF Embed QR Code Error]:", err);
    currentY -= 180;
  }

  // INSTRUÇÃO DE CHECK-IN
  const instructText1 = "Apresente este QR Code na entrada do evento para realizar o credenciamento.";
  const instructWidth1 = fontRegular.widthOfTextAtSize(instructText1, 10);
  page.drawText(instructText1, {
    x: (width - instructWidth1) / 2,
    y: currentY,
    size: 10,
    font: fontRegular,
    color: lightGray,
  });

  currentY -= 16;

  const instructText2 = `Ou acesse online: ${publicTicketUrl}`;
  const instructWidth2 = fontRegular.widthOfTextAtSize(instructText2, 9);
  page.drawText(instructText2, {
    x: (width - instructWidth2) / 2,
    y: currentY,
    size: 9,
    font: fontRegular,
    color: goldColor,
  });

  // RODAPÉ DO PDF
  page.drawText("Método Maestro • Filipe Aquino • Todos os direitos reservados", {
    x: (width - fontRegular.widthOfTextAtSize("Método Maestro • Filipe Aquino • Todos os direitos reservados", 8)) / 2,
    y: cardY + 15,
    size: 8,
    font: fontRegular,
    color: grayText,
  });

  // Compilar PDF para Buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Salva o PDF gerado no Supabase Storage (bucket: tickets) se configurado.
 * Retorna a URL pública do arquivo ou null se não configurado.
 */
export async function saveTicketPDFToStorage(
  pdfBuffer: Buffer,
  ticketCode: string
): Promise<string | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const fileName = `Ingresso-Metodo-Maestro-${ticketCode}.pdf`;

    // 1. Tentar criar o bucket 'tickets' caso não exista
    try {
      await supabaseAdmin.storage.createBucket("tickets", {
        public: true,
      });
    } catch {
      // Ignorar se o bucket já existir
    }

    // 2. Upload do arquivo PDF com upsert = true
    const { data, error } = await supabaseAdmin.storage
      .from("tickets")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.warn("[Supabase Storage Upload Warning]:", error.message);
      return null;
    }

    // 3. Obter URL pública do arquivo
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("tickets")
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error("[Save Ticket PDF Storage Error]:", error);
    return null;
  }
}
