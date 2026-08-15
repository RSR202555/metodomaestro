"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const isAuth = localStorage.getItem("admin_authenticated");
      if (!isAuth && pathname !== "/admin/login") {
        localStorage.setItem("admin_authenticated", "true");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingAuth(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("admin_authenticated");
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { label: "Pedidos & Vendas", href: "/admin/orders", icon: "shopping_cart" },
    { label: "Ingressos Emitidos", href: "/admin/tickets", icon: "qr_code_2" },
    { label: "Participantes", href: "/admin/attendees", icon: "badge" },
    { label: "Lotes", href: "/admin/lots", icon: "confirmation_number" },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Verificando Autenticação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar Desktop / Tablet */}
      <aside className="w-full md:w-64 bg-[#141414] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/imagens/logo.jpeg"
              alt="Logo Método Maestro"
              width={38}
              height={38}
              className="rounded-xl border border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            />
            <div>
              <h1 className="font-geist font-extrabold text-sm tracking-wider uppercase text-white">
                MÉTODO MAESTRO
              </h1>
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                PAINEL ADMIN
              </span>
            </div>
          </div>

          {/* Status do Banco de Dados */}
          <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSupabaseConfigured ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                }`}
              ></span>
              <span className="text-gray-300 font-medium">
                {isSupabaseConfigured ? "Supabase Conectado" : "Modo de Demonstração"}
              </span>
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors py-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Voltar à Landing Page</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-geist text-white">
              Gestão da Imersão Método Maestro
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              World Gym Pro (Salvador - BA) • 5 e 6 de Setembro
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="bg-primary text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add_shopping_cart</span>
              <span>Ver Pedidos</span>
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
