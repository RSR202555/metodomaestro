"use client";

import React from "react";
import Image from "next/image";
import { Ticket, ArrowRight, Layers, Clock, Users, Brain } from "lucide-react";

interface ActionSectionProps {
  onOpenCheckout: () => void;
}

export default function ActionSection({ onOpenCheckout }: ActionSectionProps) {
  const galleryImages = [
    { src: "/imagens/1.png", alt: "Filipe Aquino apresentando na Aula Maestro" },
    { src: "/imagens/02.png", alt: "Slides e aula teórica em ação" },
    { src: "/imagens/03.png", alt: "Discussão em grupo e instrução" },
    { src: "/imagens/04.png", alt: "Atividade prática presencial" },
    { src: "/imagens/aquino01.jpg.jpeg", alt: "Demonstração biomecânica e condução" },
    { src: "/imagens/1.png", alt: "Mentoria e feedback em tempo real" },
  ];

  const features = [
    {
      icon: Layers,
      title: "5 BLOCOS",
      description: "Identidade, Alfabetização, Lógica, Condução e Intervenção.",
    },
    {
      icon: Clock,
      title: "60 MINUTOS",
      description: "Uma nova forma de enxergar a aula inteira com intenção.",
    },
    {
      icon: Users,
      title: "100% PRESENCIAL",
      description: "Discussão, demonstração e aplicação prática do início ao fim.",
    },
    {
      icon: Brain,
      title: "1 ARQUITETURA",
      description: "Para organizar o que o professor observa, ensina, decide e ajusta.",
    },
  ];

  return (
    <section id="em-acao" className="py-20 px-4 sm:px-8 bg-[#050505] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-12">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#161616] border border-white/10 text-white/80 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            COMO A AULA ACONTECE
          </div>

          {/* Heading */}
          <h2 className="font-geist text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-white mb-4 uppercase">
            A AULA MAESTRO <br />
            EM AÇÃO
          </h2>

          {/* Subtitle */}
          <p className="font-inter text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
            Um treinamento presencial construído para observar, discutir, experimentar e organizar aquilo que acontece durante uma aula real.
          </p>
        </div>

        {/* 6 Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 glass-card group hover:border-primary/40 transition-all duration-300 shadow-lg"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Unified Card Container with 4 Features & Integrated Yellow Pill Button */}
        <div className="bg-[#0E0E0E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* 4 Vertical Columns Grid with Thin Vertical Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 mb-6 sm:mb-8">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-5 flex flex-col items-center text-center justify-start hover:bg-white/[0.02] transition-colors"
                >
                  {/* Icon */}
                  <div className="mb-5 text-primary">
                    <IconComp className="w-10 h-10 text-primary stroke-[1.5]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-geist text-xs sm:text-[13px] font-black tracking-wider text-primary uppercase mb-3 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-xs text-white/50 leading-relaxed max-w-[200px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Full-width Integrated Yellow Pill Button */}
          <div>
            <button
              onClick={onOpenCheckout}
              className="w-full bg-primary text-black font-geist font-extrabold text-xs sm:text-sm uppercase tracking-wider py-4 px-6 rounded-full shadow-[0_0_25px_rgba(242,202,80,0.35)] hover:shadow-[0_0_40px_rgba(242,202,80,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
              <Ticket className="w-5 h-5 fill-black/20" />
              <span>QUERO PARTICIPAR DA PRÓXIMA TURMA</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
