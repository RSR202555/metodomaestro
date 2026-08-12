import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const adminEmail = "filiperocha.aquino@gmail.com";
  const defaultPassword = "maestro2026!";

  try {
    // 1. Tentar criar no Supabase Auth
    let userId: string | null = null;

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: { full_name: "Filipe Rocha (Admin)" },
      });

    if (authError) {
      console.log("[Seed Admin] Auth response:", authError.message);
      // Se o usuário já existe no Auth
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = usersList?.users?.find(
        (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
      );
      if (existingUser) {
        userId = existingUser.id;
      }
    } else if (authData?.user) {
      userId = authData.user.id;
    }

    // 2. Garantir registro na tabela public.profiles como admin
    if (userId) {
      await supabaseAdmin.from("profiles").upsert(
        {
          id: userId,
          email: adminEmail,
          full_name: "Filipe Rocha",
          role: "admin",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({
      success: true,
      email: adminEmail,
      userId,
      message: `Administrador ${adminEmail} configurado com sucesso!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao configurar admin" },
      { status: 500 }
    );
  }
}
