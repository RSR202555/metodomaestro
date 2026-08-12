"use client";

import React, { useState } from "react";
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
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all">
      <div className="flex items-center justify-between px-4 sm:px-6 max-w-container-max mx-auto h-16">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-1"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <a
          href="#"
          className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-primary-fixed text-xl sm:text-2xl font-geist hover:opacity-90 transition-opacity"
        >
          MÉTODO MAESTRO
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          <button
            onClick={() => scrollToSection("problemas")}
            className="hover:text-primary transition-colors"
          >
            O Ciclo
          </button>
          <button
            onClick={() => scrollToSection("resultados")}
            className="hover:text-primary transition-colors"
          >
            Resultados
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-primary transition-colors"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheckout}
            className="bg-primary text-on-primary font-geist font-bold text-xs sm:text-sm uppercase tracking-wider py-2 px-4 sm:px-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Garantir Bilhete
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131313]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <button
            onClick={() => scrollToSection("problemas")}
            className="block w-full text-left py-2 text-on-surface hover:text-primary font-medium border-b border-white/5"
          >
            O Ciclo da Exaustão
          </button>
          <button
            onClick={() => scrollToSection("resultados")}
            className="block w-full text-left py-2 text-on-surface hover:text-primary font-medium border-b border-white/5"
          >
            Depoimentos & Prova Social
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="block w-full text-left py-2 text-on-surface hover:text-primary font-medium border-b border-white/5"
          >
            Perguntas Frequentes (FAQ)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCheckout();
            }}
            className="w-full bg-primary-container text-on-primary-container font-bold text-sm uppercase tracking-wider py-3 rounded-full text-center mt-4"
          >
            Garantir Vaga
          </button>
        </div>
      )}
    </header>
  );
}
