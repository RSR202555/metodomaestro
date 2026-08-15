import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Verificar Vercel Cron Secret (opcional em dev, ativado se CRON_SECRET estiver definido)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const startTime = Date.now();
    let queryError = null;

    // Consulta leve no banco para gerar atividade ativa no Supabase
    const { data: lotsData, error: lotsErr } = await supabaseAdmin
      .from("lots")
      .select("id, name, active")
      .limit(1);

    if (lotsErr) {
      queryError = lotsErr.message;
      // Fallback para tabela orders caso a tabela lots não responda
      const { error: ordersErr } = await supabaseAdmin
        .from("orders")
        .select("id")
        .limit(1);

      if (ordersErr) queryError = ordersErr.message;
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      service: "Supabase Keep-Alive Pulse",
      status: queryError ? "warning" : "active",
      latencyMs: durationMs,
      timestamp: new Date().toISOString(),
      message: "Banco de dados acionado com sucesso. Supabase mantido ativo.",
    });
  } catch (error: any) {
    console.error("[Cron Keep-Alive Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao acionar o Supabase",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
