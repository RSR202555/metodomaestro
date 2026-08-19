import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { IN_MEMORY_COUPONS } from "@/lib/constants/coupons";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, originalAmount = 297.0 } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Por favor, digite um código de cupom." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon: any = null;

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", cleanCode)
        .maybeSingle();

      if (!error && data) {
        coupon = data;
      }
    }

    if (!coupon) {
      coupon = IN_MEMORY_COUPONS.find((c) => c.code === cleanCode) || null;
    }

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Cupom não encontrado ou inválido." },
        { status: 404 }
      );
    }

    if (!coupon.active) {
      return NextResponse.json(
        { valid: false, error: "Este cupom de desconto está inativo." },
        { status: 400 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Este cupom de desconto já expirou." },
        { status: 400 }
      );
    }

    if (coupon.max_uses !== null && coupon.max_uses !== undefined && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: "Este cupom atingiu o limite máximo de utilizações." },
        { status: 400 }
      );
    }

    // CALCULAR O DESCONTO (LIMITE MÁXIMO DE 50% DO VALOR ORIGINAL)
    const basePrice = Number(originalAmount) || 297.0;
    let rawDiscount = 0;

    if (coupon.discount_type === "percentage") {
      rawDiscount = (basePrice * Number(coupon.discount_value)) / 100;
    } else {
      rawDiscount = Number(coupon.discount_value);
    }

    // Regra estrita: Desconto não pode ultrapassar 50% do valor do produto
    const maxDiscountAllowed = basePrice * 0.5;
    const finalDiscount = Math.min(rawDiscount, maxDiscountAllowed);
    const finalAmount = Math.max(0, basePrice - finalDiscount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: Number(coupon.discount_value),
      },
      originalAmount: basePrice,
      discountAmount: Number(finalDiscount.toFixed(2)),
      finalAmount: Number(finalAmount.toFixed(2)),
      message: `Cupom ${coupon.code} aplicado com sucesso!`,
    });
  } catch (error: any) {
    console.error("[Validate Coupon API Error]:", error);
    return NextResponse.json(
      { valid: false, error: error?.message || "Erro ao validar cupom" },
      { status: 500 }
    );
  }
}
