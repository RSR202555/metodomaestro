import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

let TURMAS_STATE = [
  {
    id: "turma_1",
    name: "Turma 1 — 12 e 13 de Setembro",
    dates: "12 e 13 de Setembro",
    schedule: "Sáb 16h30 | Dom 15h30",
    totalVagas: 30,
    active: true,
  },
  {
    id: "turma_2",
    name: "Turma 2 — 26 e 27 de Setembro",
    dates: "26 e 27 de Setembro",
    schedule: "Sáb 16h30 | Dom 15h30",
    totalVagas: 30,
    active: false, // Turma 2 oculta por padrão até que o admin a ative
  },
];

export async function GET() {
  try {
    let t1Count = 0;
    let t2Count = 0;

    if (isSupabaseConfigured) {
      const { data: orders, error } = await supabaseAdmin
        .from("orders")
        .select("turma, status")
        .in("status", ["paid", "approved"]);

      if (!error && orders) {
        orders.forEach((o) => {
          if (o.turma === "turma_2") {
            t2Count++;
          } else {
            t1Count++;
          }
        });
      }
    } else {
      try {
        const adminRes = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/orders`
        );
        const adminData = await adminRes.json();
        if (adminData?.orders) {
          adminData.orders.forEach((o: any) => {
            if (o.status === "paid" || o.status === "approved") {
              if (o.turma === "turma_2") {
                t2Count++;
              } else {
                t1Count++;
              }
            }
          });
        }
      } catch (e) {
        console.warn("[Turmas GET Local Warning]:", e);
      }
    }

    const turmasResult = TURMAS_STATE.map((t) => {
      const occupied = t.id === "turma_1" ? t1Count : t2Count;
      const available = Math.max(0, t.totalVagas - occupied);
      return {
        ...t,
        active: t.active,
        vagasOcupadas: occupied,
        vagasDisponiveis: available,
        esgotada: available <= 0,
      };
    });

    return NextResponse.json({ turmas: turmasResult });
  } catch (error: any) {
    console.error("[Turmas API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar vagas das turmas" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { turmaId, active } = await req.json();

    if (!turmaId || active === undefined) {
      return NextResponse.json(
        { error: "turmaId e active são obrigatórios." },
        { status: 400 }
      );
    }

    TURMAS_STATE = TURMAS_STATE.map((t) =>
      t.id === turmaId ? { ...t, active: Boolean(active) } : t
    );

    return NextResponse.json({
      success: true,
      turmaId,
      active: Boolean(active),
      turmas: TURMAS_STATE,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar visibilidade da turma" },
      { status: 500 }
    );
  }
}
