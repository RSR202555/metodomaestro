import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPixPayment, createCheckoutPreference } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cpf, phone, paymentMethod } = body;

    if (!name || !email || !cpf) {
      return NextResponse.json(
        { error: "Nome, E-mail e CPF são obrigatórios." },
        { status: 400 }
      );
    }

    let priceAmount = 297.0;
    let lotName = "Ingresso Método Maestro - Lote 1";
    let lotId: string | null = null;

    // Buscar o Lote Ativo no Supabase para aplicar preço e nome em tempo real
    if (isSupabaseConfigured) {
      const { data: activeLot } = await supabaseAdmin
        .from("lots")
        .select("*")
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (activeLot) {
        priceAmount = Number(activeLot.price) || 297.0;
        lotName = activeLot.name || "Ingresso Método Maestro - Lote 1";
        lotId = activeLot.id;
      }
    }

    // Gerar UUID válido previamente para casar 1:1 o external_reference do Mercado Pago com o id da tabela no Supabase
    const orderId = crypto.randomUUID();

    // 1. Criar Preferência de Checkout Pro no Mercado Pago (Link de Redirecionamento Direto)
    const preference = await createCheckoutPreference({
      transactionAmount: priceAmount,
      description: lotName,
      payerEmail: email,
      payerName: name,
      payerCpf: cpf,
      orderId: orderId,
    });

    let paymentResult = {
      id: preference.id || "mp_sim_" + Date.now(),
      qrCodePix: "",
      qrCodeBase64: "",
      status: "pending",
      ticketUrl: preference.initPoint || "https://www.mercadopago.com.br",
    };

    // Se a pessoa optou por PIX direto, geramos também a chave Copia e Cola / QR Code
    if (paymentMethod === "pix") {
      const pixPayment = await createPixPayment({
        transactionAmount: priceAmount,
        description: lotName,
        payerEmail: email,
        payerName: name,
        payerCpf: cpf,
        orderId: orderId,
      });

      if (pixPayment.qrCodePix) {
        paymentResult.qrCodePix = pixPayment.qrCodePix;
        paymentResult.qrCodeBase64 = pixPayment.qrCodeBase64;
        paymentResult.id = pixPayment.id;
        if (pixPayment.ticketUrl) {
          paymentResult.ticketUrl = pixPayment.ticketUrl;
        }
      }
    }

    // 2. Salvar Pedido no Supabase com o UUID exato
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert({
          id: orderId,
          customer_name: name,
          customer_email: email,
          customer_cpf: cpf,
          customer_phone: phone || "",
          lot_id: lotId,
          lot_name: lotName,
          amount: priceAmount,
          payment_method: paymentMethod || "pix",
          status: "pending",
          gateway_payment_id: paymentResult.id,
          qr_code_pix: paymentResult.qrCodePix,
          qr_code_url: preference.initPoint || paymentResult.ticketUrl,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[Supabase Insert Error]:", error);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      gatewayId: paymentResult.id,
      initPoint: preference.initPoint,
      checkoutUrl: preference.initPoint || paymentResult.ticketUrl,
      qrCodePix: paymentResult.qrCodePix,
      qrCodeBase64: paymentResult.qrCodeBase64,
      amount: priceAmount,
      status: paymentResult.status,
    });
  } catch (error: any) {
    console.error("[Checkout Create Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
