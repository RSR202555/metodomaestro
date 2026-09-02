"use client";

import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("filiperocha.aquino@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        // Tentar autenticação oficial no Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          localStorage.setItem("admin_authenticated", "true");
          window.location.href = "/admin/dashboard";
          return;
        }
      }

      // Senha mestra / fallback de acesso administrativo
      if (
        password === "maestro2026!" ||
        password === "maestro123"
      ) {
        localStorage.setItem("admin_authenticated", "true");
        window.location.href = "/admin/dashboard";
      } else {
        throw new Error("Senha de administrador incorreta.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] border border-primary/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] gold-glow">
        {/* Header da Tela de Login */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-yellow-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-2xl mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            M
          </div>
          <h1 className="font-geist text-2xl font-extrabold tracking-wider uppercase text-white">
            MÉTODO MAESTRO
          </h1>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">
            Acesso Restrito ao Painel Admin
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-3">
            <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              E-mail do Administrador
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-primary text-white text-sm rounded-xl p-3.5 outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-geist font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>AUTENTICANDO...</span>
              </div>
            ) : (
              <>
                <span>ENTRAR NO PAINEL ADMIN</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
