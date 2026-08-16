"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenCheckout: () => void;
}

export default function Header({ onOpenCheckout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-3 sm:px-8 max-w-[1240px] mx-auto h-16 sm:h-20 gap-2">
        {/* Left Side: Menu Icon & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-primary transition-colors p-1 shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a
            href="#"
            className="font-geist font-extrabold tracking-tight text-sm sm:text-xl text-white flex items-center gap-2 group shrink-0"
          >
            <Image
              src="/imagens/logo.jpeg"
              alt="Método Maestro Logo"
              width={34}
              height={34}
              className="rounded-lg border border-primary/40 shadow-[0_0_15px_rgba(242,202,80,0.4)] group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="hidden min-[380px]:flex items-center gap-1 whitespace-nowrap">
              <span>AULA</span>
              <span className="text-primary font-black">MAESTRO™</span>
            </div>
          </a>
        </div>

        {/* Right Side: CTA Pill Button */}
        <div className="shrink-0">
          <button
            onClick={onOpenCheckout}
            className="bg-primary text-black font-geist font-extrabold text-[11px] sm:text-sm uppercase tracking-wider py-2 sm:py-2.5 px-3.5 sm:px-7 rounded-full shadow-[0_0_20px_rgba(242,202,80,0.3)] hover:shadow-[0_0_30px_rgba(242,202,80,0.5)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            QUERO PARTICIPAR
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <button
            onClick={() => scrollToSection("detalhes")}
            className="block w-full text-left py-2 text-white hover:text-primary font-medium border-b border-white/5"
          >
            Data, Local & Horários
          </button>
          <button
            onClick={() => scrollToSection("problema")}
            className="block w-full text-left py-2 text-white hover:text-primary font-medium border-b border-white/5"
          >
            O Problema
          </button>
          <button
            onClick={() => scrollToSection("depoimentos")}
            className="block w-full text-left py-2 text-white hover:text-primary font-medium border-b border-white/5"
          >
            Depoimentos
          </button>
          <button
            onClick={() => scrollToSection("em-acao")}
            className="block w-full text-left py-2 text-white hover:text-primary font-medium border-b border-white/5"
          >
            A Aula Maestro em Ação
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="block w-full text-left py-2 text-white hover:text-primary font-medium border-b border-white/5"
          >
            Perguntas Frequentes
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCheckout();
            }}
            className="w-full bg-primary text-black font-extrabold text-xs uppercase tracking-wider py-3 rounded-full text-center mt-4"
          >
            QUERO PARTICIPAR
          </button>
        </div>
      )}
    </header>
  );
}

