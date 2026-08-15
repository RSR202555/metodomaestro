"use client";

import React from "react";
import Image from "next/image";
import { Ticket, ArrowRight, Star } from "lucide-react";

interface TestimonialsSectionProps {
  onOpenCheckout: () => void;
}

export default function TestimonialsSection({ onOpenCheckout }: TestimonialsSectionProps) {
  const testimonials = [
    {
      name: "Lucas R.",
      role: "Personal Trainer",
      quote: '"Entendi o que realmente acontece na aula e como tomar decisões melhores o tempo todo."',
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    },
    {
      name: "Juliana P.",
      role: "Personal Trainer",
      quote: '"A Aula Maestro trouxe clareza sobre a minha condução e mudou meu atendimento."',
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
    },
    {
      name: "Rafael M.",
      role: "Estudante de Ed. Física",
      quote: '"A estrutura ILAC! organizou minha forma de ensinar e intervir na prática."',
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 px-4 sm:px-8 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Stars, Title & CTA Button */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* 5 Stars */}
            <div className="flex items-center gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>

            {/* Headline */}
            <h2 className="font-geist text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight leading-[1.2] text-white mb-8 uppercase">
              PROFISSIONAIS JÁ ESTÃO <br />
              COMEÇANDO A ENXERGAR <br />
              OS 60 MINUTOS DE AULA DE <br />
              OUTRA FORMA.
            </h2>

            {/* CTA Button */}
            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto bg-primary text-black font-geist font-extrabold text-xs sm:text-sm uppercase tracking-wider py-4 px-7 rounded-full shadow-[0_0_25px_rgba(242,202,80,0.3)] hover:shadow-[0_0_40px_rgba(242,202,80,0.55)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Ticket className="w-4 h-4 fill-black/20" />
              <span>QUERO PARTICIPAR DA PRÓXIMA TURMA</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Right Column - 3 Testimonial Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center justify-between hover:border-primary/40 transition-all duration-300 group"
              >
                <div>
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-5 border-2 border-white/10 relative mx-auto">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Quote */}
                  <p className="font-inter text-xs text-white/70 leading-relaxed mb-6 italic">
                    {item.quote}
                  </p>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="font-geist text-sm font-bold text-primary mb-0.5">
                    {item.name}
                  </h3>
                  <p className="font-inter text-[11px] text-white/50 font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

