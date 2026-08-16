"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventDetailsSection() {
  const cards = [
    {
      icon: Calendar,
      label: "DATAS",
      title: "12, 13, 26 e 27 de Setembro",
      subtitle: "Sábados e Domingos de Imersão",
    },
    {
      icon: MapPin,
      label: "LOCALIZAÇÃO",
      title: "World Gym Pro",
      subtitle: "Salvador — Bahia",
    },
    {
      icon: Clock,
      label: "HORÁRIOS",
      title: "Sáb 16h30 | Dom 15h30",
      subtitle: "Sábados às 16h30 & Domingos às 15h30",
    },
  ];

  return (
    <section id="detalhes" className="py-16 px-4 sm:px-8 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-geist text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white uppercase">
            DATA, LOCAL E HORÁRIOS DA <span className="text-primary font-black">AULA MAESTRO™</span>
          </h2>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card bg-[#141414]/90 border border-white/10 hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(242,202,80,0.15)] group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary mb-5 shadow-[0_0_20px_rgba(242,202,80,0.2)] group-hover:scale-110 transition-transform">
                  <IconComp className="w-7 h-7 text-primary stroke-[1.75]" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">
                  {card.label}
                </span>
                <h3 className="font-geist text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/50 font-medium">
                  {card.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

