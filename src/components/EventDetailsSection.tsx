"use client";

import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventDetailsSection() {
  return (
    <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-[#0A0A0A] to-[#121212] relative border-y border-primary/20">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-primary/40 gold-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/40 text-primary font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              INFORMAÇÕES OFICIAIS DO EVENTO
            </span>
            <h2 className="font-geist text-2xl sm:text-4xl font-extrabold text-white">
              Data, Local e Horários da Imersão Presencial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Data */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-1">
                Datas
              </span>
              <p className="font-geist text-xl font-extrabold text-white">
                5 e 6 de Setembro
              </p>
              <p className="text-xs text-primary font-semibold mt-1">
                Edição Exclusiva
              </p>
            </div>

            {/* Box 2: Local */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-1">
                Localização
              </span>
              <p className="font-geist text-xl font-extrabold text-white">
                World Gym Pro
              </p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">
                Salvador — Bahia
              </p>
            </div>

            {/* Box 3: Horários */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-1">
                Horários
              </span>
              <div className="text-sm font-bold text-white space-y-1">
                <p><span className="text-primary font-extrabold">Sáb:</span> 15:30h às 20:00h</p>
                <p><span className="text-primary font-extrabold">Dom:</span> 14:00h às 18:00h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
