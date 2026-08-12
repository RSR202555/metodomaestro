"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  photo: string;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Carlos Silva",
    role: "São Paulo, SP - Treinador Elite",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxz-X3ckDo6cNQo-B_d8i8KOSRuATj8xEpyeyAACAUNq3eecAvKC_g3TnQ-CxPWUz9u9hfc7GP7udPxncKJPY0ZXSKzVmrhRNXMCQZyY7-F3qVsjYqaLLOUSFuyA05FFCMinOFt81PzFUBoGe0LpD1Qt4a_JHpm5RE6MV2-4t-yZGUKj_tPs81DNYX-vsumqrnCLpFFIE7JAah6780vRbpDQuQWK3Br9q0X6oytF5MFLP77cUtinxGeQ",
    text: '"A mentoria me entregou as ferramentas exatas para me posicionar como autoridade. Consegui dobrar o valor da minha hora-aula sem perder alunos e hoje atendo apenas quem valoriza meu trabalho."',
    date: "Dezembro 2023",
  },
  {
    name: "Mariana Costa",
    role: "Rio de Janeiro, RJ - Consultora de Saúde",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDGcbK7cUhmBTzGgFv63G3LUN5qgv4b18WtPITVwlSIhuoHk7vclVS4c30fJ2e06mNeEHlwSyhD3S2WG71p-mTz29s9sHY2BUpu9EG9lVMIdAQ7SdUi8pVIKtUw8OHOsBSrD2ixxfrsbcAlIB3D7_IA8QzGXdfywqTVUhqQO6grbYzCphqXXwNFsozMp_RiJT_g7GSnNKhV2E5pYHKqWXOIjRJ3TJrw1Z3mwnp2ZfjNy4GgTORs21aZg",
    text: '"O Método Maestro me mostrou como escalar o faturamento através da consultoria online estruturada. Deixei de ser escrava da agenda presencial e hoje tenho liberdade de tempo."',
    date: "Novembro 2023",
  },
  {
    name: "Roberto Neves",
    role: "Curitiba, PR - Coach Esportivo",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcywGg12O_9cA_kkdJ5373_p1iTEOlLJ41yFarLnNkVeqvMqOdY5P-K3FtOsrOGyzsVOHsMXaTbdy28ofSBuapTGDhODkNz6CbAKAc9ry0uyTW4Ic8_LvN8zuFaLsunHbc77rgtePaTzkaY_BU-hBc1R25Xc4t9G93WO1LKM9X5-5f6ruZyOmhj-V9fg8K9Ed_msjOTyRtOs7_7UK-NYDyHuyBcia4BJnhYiQeSz_tCbfwHT-ovIK7ZA",
    text: '"A mudança de mentalidade é absurda. Entender sobre posicionamento, vendas e entrega premium me fez faturar em um mês o que eu faturava em quatro anteriormente."',
    date: "Outubro 2023",
  },
];

interface TestimonialsSectionProps {
  onOpenCheckout: () => void;
}

export default function TestimonialsSection({ onOpenCheckout }: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="resultados" className="py-20 px-4 sm:px-6 bg-background relative border-t border-white/5 overflow-hidden">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-geist text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Resultados que falam por si.
          </h2>
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
            Veja o que profissionais que confiaram no Método Maestro têm a dizer sobre a transformação em suas carreiras.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="hidden md:flex justify-end gap-3 mb-6">
          <button
            onClick={() => handleScroll("left")}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-on-primary transition-all duration-300"
            aria-label="Anterior"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-on-primary transition-all duration-300"
            aria-label="Próximo"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="min-w-[300px] sm:min-w-[380px] md:min-w-[420px] glass-card rounded-2xl p-8 snap-center hover:gold-glow-hover transition-all duration-300 border border-white/10 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-surface-variant overflow-hidden border border-white/10 relative flex-shrink-0">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg font-geist">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant">{item.role}</p>
                  </div>
                </div>

                <div className="flex text-primary mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]">
                      star
                    </span>
                  ))}
                </div>

                <p className="text-on-surface-variant italic mb-6 text-sm sm:text-base leading-relaxed font-inter">
                  {item.text}
                </p>
              </div>

              <p className="text-xs text-on-surface-variant/60 uppercase tracking-wider font-semibold">
                {item.date}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center bg-surface-container rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none"></div>
          <p className="text-primary font-bold mb-6 flex items-center justify-center gap-2 text-base sm:text-lg relative z-10">
            <span className="tracking-widest">★★★★★</span>
            Centenas de profissionais já estão aplicando o Método Maestro.
          </p>
          <button
            onClick={onOpenCheckout}
            className="relative z-10 w-full sm:w-auto bg-primary text-on-primary font-geist uppercase tracking-widest py-5 px-10 rounded-full font-extrabold shadow-[0_0_35px_rgba(212,175,55,0.3)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 mx-auto text-sm sm:text-base"
          >
            QUERO FAZER PARTE DA PRÓXIMA TURMA
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
