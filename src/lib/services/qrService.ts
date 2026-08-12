import QRCode from "qrcode";

/**
 * Serviço de geração de QR Code para ingressos do Método Maestro.
 */

/**
 * Gera um QR Code em formato Data URL (base64) para renderização direta em HTML/Img.
 * @param url URL pública do ingresso (ex: https://metodomaestro.com.br/ingresso/7F4A92KD81PX)
 */
export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#0A0A0A",
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (error) {
    console.error("[QR Code DataURL Error]:", error);
    throw new Error("Falha ao gerar QR Code em base64.");
  }
}

/**
 * Gera um QR Code em formato Buffer PNG para inclusão de imagem no PDF.
 * @param url URL pública do ingresso
 */
export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#0A0A0A",
        light: "#FFFFFF",
      },
    });
    return buffer;
  } catch (error) {
    console.error("[QR Code Buffer Error]:", error);
    throw new Error("Falha ao gerar QR Code em Buffer.");
  }
}
