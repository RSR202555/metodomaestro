"use client";

import React from "react";
import Image from "next/image";
import { Ticket, ArrowRight, Play, Star } from "lucide-react";

interface HeroSectionProps {
  onOpenVideo: () => void;
  onOpenCheckout: () => void;
}

export default function HeroSection({ onOpenVideo, onOpenCheckout }: HeroSectionProps) {
  return (
    <section className="relative min-h-[700px] flex items-center justify-center px-4 sm:px-8 bg-[#050505] py-12 md:py-20 overflow-hidden">
      {/* Background Subtle Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column - Copy & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#161616] border border-white/10 text-white/80 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
            TREINAMENTO PRESENCIAL
          </div>

          {/* Main Headline */}
          <h1 className="font-geist text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight mb-6 leading-[1.12] text-white">
            SABER TREINAMENTO <br />
            NÃO É A MESMA COISA <br />
            <span className="text-primary">QUE SABER CONDUZIR </span><br />
            <span className="text-primary">UMA AULA.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-inter text-base sm:text-lg text-white/75 max-w-xl mb-8 leading-relaxed font-normal">
            Você pode conhecer exercícios, biomecânica <br className="hidden sm:inline" />
            e prescrição. <br />
            A Aula Maestro organiza o que acontece <br className="hidden sm:inline" />
            quando existe um aluno real na sua frente.
          </p>

          {/* Main CTA Button */}
          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto bg-primary text-black font-geist font-extrabold text-sm sm:text-base uppercase tracking-wider py-4 px-8 rounded-full shadow-[0_0_25px_rgba(242,202,80,0.35)] hover:shadow-[0_0_40px_rgba(242,202,80,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Ticket className="w-5 h-5 fill-black/20" />
            <span>QUERO PARTICIPAR DA AULA MAESTRO</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Column - Video Thumbnail Card */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <div
            onClick={onOpenVideo}
            className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden relative glass-card group cursor-pointer border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-2xl"
          >
            <Image
              src="/imagens/aquino01.jpg.jpeg"
              alt="Filipe Aquino - Criador do Método Maestro"
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              priority
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(242,202,80,0.6)] group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 fill-black text-black ml-1" />
              </div>
            </div>

            {/* Bottom Overlay Pills */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-20 gap-2">
              <span className="text-xs font-bold bg-[#0A0A0A]/90 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                Filipe Aquino
              </span>
              <span className="text-[11px] sm:text-xs font-medium bg-[#0A0A0A]/90 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1.5 text-white/90">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                Personal Trainer • Educador • Criador do Método Maestro
              </span>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

