"use client";

import React from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { Calendar, MapPin, Clock, Play, Star, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onOpenVideo: () => void;
  onOpenCheckout: () => void;
}

export default function HeroSection({ onOpenVideo, onOpenCheckout }: HeroSectionProps) {
  return (
    <section className="relative min-h-[820px] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-[#0A0A0A] py-12 md:py-16">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-primary-container/20 via-background to-background pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Event Quick Info Pill */}
        <div className="bg-gradient-to-r from-primary-container/20 via-primary/20 to-primary-container/20 border border-primary/40 rounded-full px-4 sm:px-6 py-2.5 mb-6 backdrop-blur-md flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <Calendar className="w-4 h-4 text-primary" />
            5 e 6 DE SETEMBRO
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            World Gym Pro (Salvador - BA)
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <Clock className="w-4 h-4 text-primary" />
            Sáb: 15h30-20h | Dom: 14h-18h
          </span>
        </div>

        {/* Urgent Batch Countdown */}
        <CountdownTimer />

        {/* Video Card Trigger */}
        <div
          onClick={onOpenVideo}
          className="w-full max-w-xl aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden relative glass-card group cursor-pointer mb-8 shadow-2xl border border-white/10 hover:border-primary/40 transition-all duration-500"
        >
          <Image
            src="/imagens/aquino01.jpg.jpeg"
            alt="Filipe Aquino - Mentor do Método Maestro"
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
            priority
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-container/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform duration-500 ease-out">
              <Play className="w-8 h-8 fill-black text-black ml-1" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <span className="text-xs sm:text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              Filipe Aquino
            </span>
            <span className="text-xs sm:text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              5.0 (Mais de 500 mentorados)
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Main Headline */}
        <h1 className="font-geist text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
          MÉTODO MAESTRO:<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-primary-fixed">
            A ELITE DO PERSONAL TRAINER
          </span>
        </h1>

        <p className="font-inter text-base sm:text-xl text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
          A mentoria presencial definitiva para escalar seu faturamento e dominar a autoridade no mercado de alto padrão.
        </p>

        <button
          onClick={onOpenCheckout}
          className="w-full sm:w-auto bg-primary-container text-on-primary-container font-geist font-bold text-sm uppercase tracking-widest py-5 px-10 rounded-full shadow-[0_0_35px_rgba(212,175,55,0.3)] hover:shadow-[0_0_55px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
        >
          GARANTIR MEU BILHETE
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
