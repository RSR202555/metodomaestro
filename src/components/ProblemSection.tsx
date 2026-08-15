"use client";

import React from "react";
import { ClipboardList, User, Presentation, Sliders } from "lucide-react";

export default function ProblemSection() {
  const steps = [
    {
      icon: ClipboardList,
      number: "1.",
      title: "O TREINO ESTÁ PRESCRITO",
      description: "Exercícios, séries, repetições e cargas já foram definidos.",
    },
    {
      icon: User,
      number: "2.",
      title: "O ALUNO CHEGA",
      description: "Com atenção, humor, medo, fadiga, dúvidas, limitações e respostas próprias.",
    },
    {
      icon: Presentation,
      number: "3.",
      title: "A AULA ACONTECE",
      description: "O professor precisa observar, comunicar, ensinar, organizar e sustentar a qualidade.",
    },
    {
      icon: Sliders,
      number: "4.",
      title: "AS DECISÕES APARECEM",
      description: "Ajustar, regredir, progredir, intervir, mudar a tarefa ou simplesmente não mexer.",
    },
  ];

  return (
    <section id="problema" className="py-16 sm:py-20 px-4 sm:px-8 bg-[#050505] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Side: Text */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <h2 className="font-geist text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.15] text-white mb-6 uppercase">
              O PROBLEMA NUNCA FOI <br />
              FALTA DE <span className="text-primary font-black">CONHECIMENTO</span> <br />
              <span className="text-primary font-black">TÉCNICO.</span>
            </h2>

            <p className="font-inter text-base sm:text-lg text-white/60 max-w-md leading-relaxed">
              O problema é que quase ninguém <br className="hidden sm:inline" />
              ensinou você a conduzir <strong className="text-white font-bold">uma aula.</strong>
            </p>
          </div>

          {/* Right Side: Single Unified Container with 4 Vertical Columns & Integrated Bottom Bar */}
          <div className="lg:col-span-7 bg-[#0E0E0E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* 4 Vertical Columns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-5 flex flex-col items-center text-center justify-start hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Icon */}
                    <div className="mb-5 text-primary">
                      <IconComp className="w-9 h-9 text-primary stroke-[1.5]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-geist text-xs sm:text-[13px] font-extrabold tracking-wider text-primary uppercase mb-3 leading-snug">
                      {step.number} {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-inter text-xs text-white/50 leading-relaxed max-w-[200px]">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Integrated Bottom Sentence */}
            <div className="border-t border-white/10 bg-[#0A0A0A] py-4 px-6 text-center">
              <p className="font-geist text-base sm:text-lg font-bold text-primary tracking-wide">
                É aí que começa a condução.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


