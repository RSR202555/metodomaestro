"use client";

import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventDetailsSection() {
  return (
    <section id="detalhes" className="py-16 px-4 sm:px-8 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-geist text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white uppercase">
            DATA, LOCAL E HORÁRIOS DA <span className="text-primary font-black">AULA MAESTRO™</span>
          </h2>
        </div>

        {/* 3 Glassmorphism Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: DATAS */}
          <div className="glass-card bg-[#141414]/90 border border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-transparent border border-primary/40 flex items-center justify-center text-primary mb-5 shadow-[0_0_15px_rgba(242,202,80,0.15)]">
              <Calendar className="w-7 h-7 text-primary stroke-[1.75]" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">
              DATAS
            </span>
            <h3 className="font-geist text-xl sm:text-2xl font-bold text-white mb-1">
              5 e 6 de Setembro
            </h3>
            <p className="text-xs sm:text-sm text-white/50 font-medium">
              Treinamento presencial
            </p>
          </div>

          {/* Card 2: LOCALIZAÇÃO */}
          <div className="glass-card bg-[#141414]/90 border border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-transparent border border-primary/40 flex items-center justify-center text-primary mb-5 shadow-[0_0_15px_rgba(242,202,80,0.15)]">
              <MapPin className="w-7 h-7 text-primary stroke-[1.75]" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">
              LOCALIZAÇÃO
            </span>
            <h3 className="font-geist text-xl sm:text-2xl font-bold text-white mb-1">
              World Gym Pro
            </h3>
            <p className="text-xs sm:text-sm text-white/50 font-medium">
              Salvador — Bahia
            </p>
          </div>

          {/* Card 3: HORÁRIOS */}
          <div className="glass-card bg-[#141414]/90 border border-white/10 hover:border-primary/40 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-transparent border border-primary/40 flex items-center justify-center text-primary mb-5 shadow-[0_0_15px_rgba(242,202,80,0.15)]">
              <Clock className="w-7 h-7 text-primary stroke-[1.75]" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">
              HORÁRIOS
            </span>
            <h3 className="font-geist text-xl sm:text-2xl font-bold text-white mb-1">
              Sábado e Domingo
            </h3>
            <p className="text-xs sm:text-sm text-white/50 font-medium">
              09h às 13h | 14h às 18h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

