"use client";

import React from "react";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#050505] text-white/70 py-16 px-4 sm:px-8 border-t border-white/5 font-inter">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Column - Brand & Description */}
        <div className="md:col-span-5 flex flex-col items-start text-left">
          <a href="#" className="font-geist font-extrabold text-xl sm:text-2xl text-white mb-3 flex items-center gap-3 group">
            <Image
              src="/imagens/logo.jpeg"
              alt="Logo Método Maestro"
              width={38}
              height={38}
              className="rounded-xl border border-primary/40 shadow-[0_0_15px_rgba(242,202,80,0.4)] group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-1">
              <span>AULA</span>
              <span className="text-primary font-black">MAESTRO™</span>
            </div>
          </a>
          <p className="text-xs sm:text-sm text-white/50 max-w-sm leading-relaxed">
            Ensinamos o professor a conduzir aulas com intenção, clareza e segurança.
          </p>
        </div>

        {/* Middle Column - Navigation Links */}
        <div className="md:col-span-3 flex flex-col items-start">
          <h4 className="font-geist text-xs font-extrabold uppercase tracking-widest text-white mb-4">
            NAVEGAÇÃO
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60 font-medium">
            <li>
              <button onClick={() => scrollToSection("detalhes")} className="hover:text-primary transition-colors">
                Sobre
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("em-acao")} className="hover:text-primary transition-colors">
                Programa
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("depoimentos")} className="hover:text-primary transition-colors">
                Depoimentos
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("faq")} className="hover:text-primary transition-colors">
                Perguntas Frequentes
              </button>
            </li>
          </ul>
        </div>

        {/* Right Column - Social & Method Maestro Badge */}
        <div className="md:col-span-4 flex flex-col items-start md:items-end justify-between h-full">
          <div className="flex flex-col items-start md:items-end mb-6">
            <h4 className="font-geist text-xs font-extrabold uppercase tracking-widest text-white mb-3">
              SIGA
            </h4>
            <div className="flex items-center gap-3 text-white/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Square Brand Box */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <Image
              src="/imagens/logo.jpeg"
              alt="Emblema Método Maestro"
              width={32}
              height={32}
              className="rounded-lg border border-primary/40 shadow-[0_0_10px_rgba(242,202,80,0.3)]"
            />
            <span className="font-geist text-xs font-bold text-white">
              Método Maestro™
            </span>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-[1240px] mx-auto mt-16 pt-8 border-t border-white/5 text-center text-[11px] text-white/40">
        © 2024 Aula Maestro™. Todos os direitos reservados.
      </div>
    </footer>
  );
}
