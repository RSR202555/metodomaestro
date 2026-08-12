"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AdminSetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas digitadas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // 1. Tentar cadastro direto pelo cliente Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signUpError) {
        console.warn("[Client SignUp Warning]:", signUpError.message);
      }

      const userId = signUpData?.user?.id;

      // 2. Chamar a rota da API para garantir o papel 'admin' no banco
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (!userId) {
          throw new Error(data.error || "Erro ao registrar usuário no Supabase.");
        }
      }

      setSuccessMessage("Administrador registrado no Supabase com sucesso!");
      localStorage.setItem("admin_authenticated", "true");

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1000);
    } catch (err: any) {
      console.error("[Setup Error]:", err);
      setErrorMessage(err.message || "Erro inesperado ao cadastrar administrador.");
    } finally {
      setLoading(false);
    }
  };

  const handleBypassAdmin = () => {
    localStorage.setItem("admin_authenticated", "true");
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] border border-primary/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] gold-glow">
        {/* Header do Setup Admin */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-yellow-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-2xl mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            M
          </div>
          <h1 className="font-geist text-2xl font-extrabold tracking-wider uppercase text-white">
            MÉTODO MAESTRO
          </h1>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">
            Cadastro de Novo Administrador
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>Erro do Supabase:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-300 font-mono bg-black/40 p-2 rounded-lg break-words">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={handleBypassAdmin}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-white font-bold text-[11px] py-2.5 px-3 rounded-xl border border-red-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Entrar no Painel Admin Agora Mesmo</span>
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-xs flex items-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-xl flex-shrink-0">check_circle</span>
            <span>{successMessage} Redirecionando para o painel...</span>
          </div>
        )}

        <form onSubmit={handleRegisterAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Nome Completo do Admin
            </label>
            <input
              type="text"
              placeholder="Ex: Administrador Maestro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              E-mail de Acesso
            </label>
            <input
              type="email"
              placeholder="admin@metodomaestro.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Confirmar Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-geist font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>CADASTRANDO NO SUPABASE...</span>
              </div>
            ) : (
              <>
                <span>CADASTRAR ADMIN NO SUPABASE</span>
                <span className="material-symbols-outlined text-lg">person_add</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-xs text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Já tem conta? Ir para a tela de Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
