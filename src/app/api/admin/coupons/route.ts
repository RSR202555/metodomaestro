import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { IN_MEMORY_COUPONS, CouponData } from "@/lib/constants/coupons";

export const dynamic = "force-dynamic";

let LOCAL_COUPONS: CouponData[] = [...IN_MEMORY_COUPONS];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        LOCAL_COUPONS = data;
        return NextResponse.json({ coupons: data, source: "supabase" });
      }
    }
  } catch (error: any) {
    console.warn("[GET Coupons Supabase Warning]:", error?.message);
  }

  return NextResponse.json({ coupons: LOCAL_COUPONS, source: "local" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discount_type = "percentage", discount_value, max_uses, expires_at, active = true } = body;

    if (!code || discount_value === undefined) {
      return NextResponse.json(
        { error: "Código e valor do desconto são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const parsedValue = Number(discount_value);

    if (discount_type === "percentage" && (parsedValue <= 0 || parsedValue > 50)) {
      return NextResponse.json(
        { error: "O desconto percentual deve ser entre 1% e 50%." },
        { status: 400 }
      );
    }

    const typeVal: "percentage" | "fixed" = discount_type === "fixed" ? "fixed" : "percentage";

    const newCoupon: CouponData = {
      id: "cpn_" + Math.random().toString(36).substring(2, 10),
      code: cleanCode,
      discount_type: typeVal,
      discount_value: parsedValue,
      max_uses: max_uses ? Number(max_uses) : null,
      used_count: 0,
      active: Boolean(active),
      expires_at: expires_at || null,
    };

    LOCAL_COUPONS.unshift(newCoupon);

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from("coupons")
        .insert({
          code: cleanCode,
          discount_type: newCoupon.discount_type,
          discount_value: parsedValue,
          max_uses: newCoupon.max_uses,
          active: newCoupon.active,
          expires_at: newCoupon.expires_at,
        })
        .select("*")
        .single();

      if (error) {
        console.warn("[Insert Coupon Supabase Warning]:", error.message);
      } else if (data) {
        newCoupon.id = data.id;
      }
    }

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    console.error("[POST Coupon Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao criar cupom" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, code, discount_type, discount_value, max_uses, active, expires_at } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do cupom é obrigatório." }, { status: 400 });
    }

    let updatedCoupon: any = null;

    LOCAL_COUPONS = LOCAL_COUPONS.map((c) => {
      if (c.id === id || c.code === code) {
        updatedCoupon = {
          ...c,
          code: code ? code.trim().toUpperCase() : c.code,
          discount_type: discount_type !== undefined ? discount_type : c.discount_type,
          discount_value: discount_value !== undefined ? Number(discount_value) : c.discount_value,
          max_uses: max_uses !== undefined ? (max_uses ? Number(max_uses) : null) : c.max_uses,
          active: active !== undefined ? Boolean(active) : c.active,
          expires_at: expires_at !== undefined ? expires_at : c.expires_at,
          updated_at: new Date().toISOString(),
        };
        return updatedCoupon;
      }
      return c;
    });

    if (isSupabaseConfigured) {
      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (code !== undefined) updatePayload.code = code.trim().toUpperCase();
      if (discount_type !== undefined) updatePayload.discount_type = discount_type;
      if (discount_value !== undefined) updatePayload.discount_value = Number(discount_value);
      if (max_uses !== undefined) updatePayload.max_uses = max_uses ? Number(max_uses) : null;
      if (active !== undefined) updatePayload.active = Boolean(active);
      if (expires_at !== undefined) updatePayload.expires_at = expires_at;

      await supabaseAdmin.from("coupons").update(updatePayload).eq("id", id);
    }

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error: any) {
    console.error("[PATCH Coupon Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar cupom" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do cupom é obrigatório." }, { status: 400 });
    }

    LOCAL_COUPONS = LOCAL_COUPONS.filter((c) => c.id !== id);

    if (isSupabaseConfigured) {
      await supabaseAdmin.from("coupons").delete().eq("id", id);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("[DELETE Coupon Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao excluir cupom" },
      { status: 500 }
    );
  }
}
