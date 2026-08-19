import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPixPayment, createCheckoutPreference } from "@/lib/mercadopago";
import { IN_MEMORY_COUPONS } from "@/lib/constants/coupons";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cpf, phone, paymentMethod, turma = "turma_1", couponCode } = body;

    if (!name || !email || !cpf) {
      return NextResponse.json(
        { error: "Nome, E-mail e CPF são obrigatórios." },
        { status: 400 }
      );
    }

    const selectedTurma = turma === "turma_2" ? "turma_2" : "turma_1";

    // Validar se a turma escolhida não ultrapassou o limite de 30 vagas
    if (isSupabaseConfigured) {
      const { count, error: countErr } = await supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("turma", selectedTurma)
        .in("status", ["paid", "approved"]);

      if (!countErr && count !== null && count >= 30) {
        return NextResponse.json(
          { error: `A turma selecionada (${selectedTurma === "turma_1" ? "12 e 13 de Setembro" : "26 e 27 de Setembro"}) já atingiu o limite máximo de 30 vagas.` },
          { status: 400 }
        );
      }
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

    // APLICAR CUPOM DE DESCONTO SE INFORMADO
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      let coupon: any = null;

      if (isSupabaseConfigured) {
        const { data } = await supabaseAdmin
          .from("coupons")
          .select("*")
          .eq("code", cleanCode)
          .maybeSingle();
        if (data) coupon = data;
      }

      if (!coupon) {
        coupon = IN_MEMORY_COUPONS.find((c) => c.code === cleanCode) || null;
      }

      if (coupon && coupon.active) {
        const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
        const isMaxReached =
          coupon.max_uses !== null && coupon.max_uses !== undefined && coupon.used_count >= coupon.max_uses;

        if (!isExpired && !isMaxReached) {
          const rawDisc =
            coupon.discount_type === "percentage"
              ? (priceAmount * Number(coupon.discount_value)) / 100
              : Number(coupon.discount_value);

          // Limite estrito de no máximo 50% de desconto
          discountAmount = Number(Math.min(rawDisc, priceAmount * 0.5).toFixed(2));
          priceAmount = Number(Math.max(0, priceAmount - discountAmount).toFixed(2));
          appliedCouponCode = coupon.code;

          // Incrementar contagem de usos
          if (isSupabaseConfigured && coupon.id) {
            await supabaseAdmin
              .from("coupons")
              .update({ used_count: (coupon.used_count || 0) + 1 })
              .eq("id", coupon.id);
          }
        }
      }
    }

    // Gerar UUID válido previamente para casar 1:1 o external_reference do Mercado Pago com o id da tabela no Supabase
    const orderId = crypto.randomUUID();

    const displayDescription = appliedCouponCode
      ? `${lotName} (Cupom ${appliedCouponCode})`
      : lotName;

    // 1. Criar Preferência de Checkout Pro no Mercado Pago (Link de Redirecionamento Direto)
    const preference = await createCheckoutPreference({
      transactionAmount: priceAmount,
      description: displayDescription,
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
        description: displayDescription,
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
          turma: selectedTurma,
          coupon_code: appliedCouponCode,
          discount_amount: discountAmount,
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
