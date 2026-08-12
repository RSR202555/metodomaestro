"use client";

import React from "react";
import Image from "next/image";
import { Rocket, Lock, CheckCircle2, CreditCard } from "lucide-react";

interface FinalCTASectionProps {
  onOpenCheckout: () => void;
}

export default function FinalCTASection({ onOpenCheckout }: FinalCTASectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 bg-[#050505] relative border-t border-primary/20 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-t from-primary/10 via-black to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full overflow-hidden mb-8 border-4 border-primary/40 gold-glow relative shadow-2xl">
          <Image
            src="/imagens/aquino01.jpg.jpeg"
            alt="Filipe Aquino"
            fill
            unoptimized
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        <h2 className="font-geist text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
          A HORA DA VIRADA É <span className="text-primary">AGORA</span>.
        </h2>

        <p className="font-inter text-base sm:text-lg text-on-surface-variant mb-10 max-w-xl mx-auto leading-relaxed">
          Deixe de ser apenas mais um no mercado e junte-se à elite dos Personal Trainers. As vagas são limitadíssimas e o próximo lote terá um reajuste agressivo.
        </p>

        <button
          onClick={onOpenCheckout}
          className="w-full sm:w-auto bg-primary text-on-primary font-geist font-extrabold uppercase tracking-widest py-6 px-10 sm:px-14 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.45)] hover:shadow-[0_0_65px_rgba(212,175,55,0.65)] transition-all duration-300 transform hover:-translate-y-1.5 active:translate-y-0 flex items-center justify-center gap-3 text-base sm:text-lg mx-auto"
        >
          GARANTIR MINHA VAGA IMEDIATAMENTE
          <Rocket className="w-6 h-6" />
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-green-500" />
            Compra 100% Segura
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Garantia de 7 Dias
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-blue-400" />
            Até 12x no Cartão ou PIX
          </span>
        </div>
      </div>
    </section>
  );
}
