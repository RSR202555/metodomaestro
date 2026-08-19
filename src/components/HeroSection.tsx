"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Ticket, ArrowRight, Play, Star, Volume2, Sparkles, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenVideo: () => void;
  onOpenCheckout: () => void;
}

export default function HeroSection({ onOpenVideo, onOpenCheckout }: HeroSectionProps) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);

  const handlePlayInline = () => {
    setIsPlayingInline(true);
    setTimeout(() => {
      if (inlineVideoRef.current) {
        inlineVideoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <section className="relative min-h-[700px] flex items-center justify-center px-4 sm:px-8 bg-[#050505] py-12 md:py-20 overflow-hidden">
      {/* Background Subtle Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column - Copy & Bullets */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Brand Emblem Logo Header */}
          <div className="flex items-center gap-3 mb-5">
            <Image
              src="/imagens/logo.jpeg"
              alt="Logo Método Maestro"
              width={46}
              height={46}
              className="rounded-xl border border-primary/50 shadow-[0_0_25px_rgba(242,202,80,0.45)]"
            />
            <div className="flex flex-col">
              <span className="font-geist font-black tracking-wider text-white text-base leading-tight">
                AULA <span className="text-primary font-black">MAESTRO</span>
              </span>
              <span className="text-[11px] font-bold text-white/70 tracking-widest uppercase">
                Por Filipe Aquino
              </span>
            </div>
          </div>

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-primary/30 text-primary text-xs font-extrabold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(242,202,80,0.15)]">
            <Sparkles className="w-3.5 h-3.5 fill-primary" />
            <span>TREINAMENTO PRESENCIAL DE ELITE</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-geist text-3xl sm:text-5xl lg:text-[48px] font-black tracking-tight mb-6 leading-[1.12] text-white">
            SABER TREINAMENTO <br />
            NÃO É A MESMA COISA <br />
            <span className="text-primary">QUE SABER CONDUZIR </span><br />
            <span className="text-primary">UMA AULA.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-inter text-base sm:text-lg text-white/80 max-w-xl mb-6 leading-relaxed font-normal">
            Você pode conhecer exercícios, biomecânica e prescrição. <br />
            A Aula Maestro organiza o que acontece quando existe um aluno real na sua frente.
          </p>

          {/* Key Bullet Points */}
          <div className="space-y-3.5 mb-2 text-sm sm:text-base text-white/90 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Metodologia 100% prática e aplicável no dia a dia</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Posicionamento de alto valor e condução com autoridade</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Dois dias de evento: 12/09 às 16h30 (Teoria) e 13/09 às 15h30 (Prática)</span>
            </div>
          </div>
        </div>

        {/* Right Column - Premium Video Showcase + Pulsing CTA Below Video */}
        <div className="lg:col-span-6 w-full flex flex-col items-center">
          <div className="w-full max-w-xl bg-[#0F0F0F] border border-white/15 rounded-3xl p-3.5 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] hover:border-primary/50 transition-all duration-500 glass-card flex flex-col items-center">
            
            {/* Header Badge Above Video */}
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-black text-white uppercase tracking-wider font-geist">
                  VÍDEO DE APRESENTAÇÃO
                </span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                1:22 MIN
              </span>
            </div>

            {/* Video Frame Container - Uncropped (object-contain) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-inner group">
              {isPlayingInline ? (
                <video
                  ref={inlineVideoRef}
                  src="/imagens/ANUNCIO%20MAESTRO.mp4"
                  poster="/imagens/aquino01.jpg.jpeg"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black rounded-2xl"
                />
              ) : (
                <>
                  {/* Poster Image with object-contain */}
                  <Image
                    src="/imagens/aquino01.jpg.jpeg"
                    alt="Filipe Aquino - Anúncio Maestro"
                    fill
                    unoptimized
                    className="object-contain bg-black transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />

                  {/* Play Overlay */}
                  <div
                    onClick={handlePlayInline}
                    className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(242,202,80,0.7)] group-hover:scale-110 active:scale-95 transition-all duration-300">
                      <Play className="w-8 h-8 fill-black text-black ml-1" />
                    </div>
                    <span className="mt-3.5 text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider bg-black/80 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md group-hover:border-primary/50 group-hover:text-primary transition-all">
                      Clique para assistir o anúncio
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Author Footer Bar Below Video Frame */}
            <div className="w-full mt-3.5 px-1 flex items-center justify-between text-xs text-white/80 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Filipe Aquino</span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">Criador do Método Maestro</span>
              </div>
              <button
                onClick={onOpenVideo}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Star className="w-3 h-3 fill-primary" />
                <span>Tela Cheia</span>
              </button>
            </div>

            {/* HIGHLIGHTED PULSING CTA BUTTON BELOW VIDEO */}
            <div className="w-full mt-4">
              <button
                onClick={onOpenCheckout}
                className="w-full bg-primary text-black font-geist font-black text-base sm:text-lg uppercase tracking-wider py-4 sm:py-4.5 px-6 rounded-full shadow-[0_0_35px_rgba(242,202,80,0.6)] hover:shadow-[0_0_60px_rgba(242,202,80,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer animate-pulse"
              >
                <Ticket className="w-6 h-6 fill-black/20" />
                <span>QUERO PARTICIPAR</span>
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

