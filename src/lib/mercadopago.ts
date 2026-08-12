import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

export interface PaymentParams {
  transactionAmount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  payerCpf: string;
}

export async function createCheckoutPreference(params: PaymentParams) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
  const isMercadoPagoConfigured = Boolean(
    accessToken && !accessToken.includes("placeholder")
  );

  if (isMercadoPagoConfigured) {
    try {
      const client = new MercadoPagoConfig({ accessToken });
      const preference = new Preference(client);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const nameParts = params.payerName.trim().split(" ");
      const firstName = nameParts[0] || "Cliente";
      const lastName = nameParts.slice(1).join(" ") || "Maestro";
      const cleanCpf = params.payerCpf.replace(/\D/g, "");

      const payerData: any = {
        name: firstName,
        surname: lastName,
        email: params.payerEmail,
      };

      if (cleanCpf && cleanCpf.length === 11) {
        payerData.identification = {
          type: "CPF",
          number: cleanCpf,
        };
      }

      const body: any = {
        items: [
          {
            id: "ingresso-metodo-maestro",
            title: params.description,
            unit_price: Number(params.transactionAmount),
            quantity: 1,
            currency_id: "BRL",
          },
        ],
        payer: payerData,
        auto_return: "approved",
        back_urls: {
          success: `${siteUrl}/obrigado?status=approved`,
          failure: `${siteUrl}?payment=failure`,
          pending: `${siteUrl}/obrigado?status=pending`,
        },
        statement_descriptor: "METODOMAESTRO",
        external_reference: "ref_" + Date.now(),
      };

      const response = await preference.create({ body });

      console.log("[MercadoPago Preference Created Success]:", response.id, response.init_point);

      if (response.init_point || response.sandbox_init_point) {
        return {
          id: response.id,
          initPoint: response.init_point || response.sandbox_init_point || "",
        };
      }
    } catch (error: any) {
      console.error("[MercadoPago Preference Error Details]:", error?.message || error, error?.cause || "");
    }
  }

  return {
    id: "pref_sim_" + Date.now(),
    initPoint: "",
  };
}

export async function createPixPayment(params: PaymentParams) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
  const isMercadoPagoConfigured = Boolean(
    accessToken && !accessToken.includes("placeholder")
  );

  if (isMercadoPagoConfigured) {
    try {
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      const nameParts = params.payerName.trim().split(" ");
      const firstName = nameParts[0] || "Cliente";
      const lastName = nameParts.slice(1).join(" ") || "Maestro";
      const cleanCpf = params.payerCpf.replace(/\D/g, "");

      const body: any = {
        transaction_amount: Number(params.transactionAmount),
        description: params.description,
        payment_method_id: "pix",
        payer: {
          email: params.payerEmail,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: "CPF",
            number: cleanCpf && cleanCpf.length === 11 ? cleanCpf : "00000000000",
          },
        },
      };

      const response = await payment.create({ body });
      const pixData = response.point_of_interaction?.transaction_data;

      console.log("[MercadoPago PIX Success]:", response.id, response.status);

      return {
        id: String(response.id),
        status: response.status || "pending",
        qrCodePix: pixData?.qr_code || "",
        qrCodeBase64: pixData?.qr_code_base64 || "",
        ticketUrl: pixData?.ticket_url || "",
      };
    } catch (error: any) {
      console.error("[MercadoPago PIX Error Details]:", error?.message || error, error?.cause || "");
    }
  }

  // SIMULAÇÃO DE FALLBACK PARA TESTES
  const simulatedId = "mp_sim_" + Math.random().toString(36).substring(2, 10);
  const simulatedPixCode = `00020126580014BR.GOV.BCB.PIX0136metodomaestro-immersao-${simulatedId}5204000053039865406297.005802BR5925METODO MAESTRO IMERSAO6009SALVADOR62070503***6304E8A2`;

  return {
    id: simulatedId,
    status: "pending",
    qrCodePix: simulatedPixCode,
    qrCodeBase64: "",
    ticketUrl: "",
  };
}

/**
 * Consulta a API do Mercado Pago para obter o status real e verificado de um pagamento.
 * Evita confiar unicamente nos dados do payload inicial do webhook.
 */
export async function getPaymentDetails(paymentId: string | number) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
  const isMercadoPagoConfigured = Boolean(
    accessToken && !accessToken.includes("placeholder")
  );

  if (isMercadoPagoConfigured && paymentId && !String(paymentId).startsWith("mp_sim_")) {
    try {
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      const response = await payment.get({ id: String(paymentId) });

      console.log(`[MercadoPago GetPayment Success]: ID: ${response.id}, Status: ${response.status}`);
      return {
        id: String(response.id),
        status: response.status || "pending",
        statusDetail: response.status_detail,
        payerEmail: response.payer?.email,
        transactionAmount: response.transaction_amount,
        isApproved: response.status === "approved",
      };
    } catch (error: any) {
      console.error("[MercadoPago GetPayment Error]:", error?.message || error);
    }
  }

  // Fallback seguro: se a consulta falhar ou for ID simulado, não forçar aprovação falsa
  return {
    id: String(paymentId),
    status: "pending",
    statusDetail: "pending",
    isApproved: false,
  };
}

