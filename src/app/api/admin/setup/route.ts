import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Nome, E-mail e Senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    console.log("[Setup Admin] Tentando cadastrar:", email);

    // 1. Tentar criar o usuário via Supabase Auth Admin API
    let userId: string | null = null;

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

    if (authError) {
      console.log("[Setup Admin Auth Error]:", authError.message, authError);
      
      // Se o erro for que já existe, tentamos listar para buscar o ID
      const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (!listError && usersList?.users) {
        const existingUser = usersList.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          userId = existingUser.id;
          console.log("[Setup Admin] Usuário existente localizado:", userId);
        }
      }

      if (!userId) {
        return NextResponse.json(
          { error: `Erro do Supabase: ${authError.message}` },
          { status: 400 }
        );
      }
    } else if (authData?.user) {
      userId = authData.user.id;
      console.log("[Setup Admin] Novo usuário criado no Auth:", userId);
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Não foi possível obter o ID do usuário criado no Supabase." },
        { status: 500 }
      );
    }

    // 2. Inserir ou atualizar na tabela public.profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          full_name: name,
          role: "admin",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("[Setup Profile Error]:", profileError.message);
      // Se a tabela public.profiles ainda não tiver sido criada no Supabase
      if (profileError.message.includes("does not exist") || profileError.code === "42P01") {
        return NextResponse.json(
          { 
            error: "A tabela 'public.profiles' não existe no seu Supabase. Por favor, certifique-se de executar o script SQL no SQL Editor do Supabase antes de cadastrar o admin." 
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Erro no perfil: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Administrador cadastrado com sucesso!",
      userId,
    });
  } catch (error: any) {
    console.error("[Setup API Error Catch]:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao cadastrar administrador." },
      { status: 500 }
    );
  }
}
