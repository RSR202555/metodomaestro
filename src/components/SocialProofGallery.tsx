"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MaestroImage {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

const maestroGallery: MaestroImage[] = [
  {
    id: 1,
    src: "/imagens/1.png",
    title: "Imersão Presencial Maestro",
    category: "Mentoria Presencial",
    description:
      "Treinamento estratégico presencial sobre vendas, posicionamento e gestão de alto valor para personal trainers.",
  },
  {
    id: 2,
    src: "/imagens/02.png",
    title: "Networking & Conexões de Elite",
    category: "Network Exclusivo",
    description:
      "Troca direta de experiências e parcerias com os melhores profissionais do mercado fitness nacional.",
  },
  {
    id: 3,
    src: "/imagens/03.png",
    title: "Metodologia Prática & Posicionamento",
    category: "Treinamento & Ação",
    description:
      "Estruturação de planos de ação reais para valorização da hora-aula e escala de consultorias.",
  },
  {
    id: 4,
    src: "/imagens/04.png",
    title: "Comunidade & Cultura de Alta Performance",
    category: "Comunidade Maestro",
    description:
      "A energia contagiante de quem decidiu sair da média e dominar o seu mercado na educação física.",
  },
];

interface SocialProofGalleryProps {
  onOpenCheckout?: () => void;
}

export default function SocialProofGallery({ onOpenCheckout }: SocialProofGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Navegação por teclado no Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === null || prev === 0 ? maestroGallery.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === null || prev === maestroGallery.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const activeImage = selectedIndex !== null ? maestroGallery[selectedIndex] : null;

  return (
    <section id="galeria-maestro" className="py-20 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-white/10">
      {/* Glow Effects de Fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-container-max mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            EDIÇÕES ANTERIORES DO MÉTODOS MAESTRO
          </div>
          <h2 className="font-geist text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            A Experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37]">Maestro em Ação</span>
          </h2>
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Confira a energia, os bastidores e o ambiente de alta performance das edições presenciais anteriores. Clique nas fotos para visualizá-las em tamanho completo.
          </p>
        </div>

        {/* Grid Equilibrado 2x2 com Aspect Ratio Amplo para Exibir 100% da Imagem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {maestroGallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className="group relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer border border-white/15 hover:border-primary/70 transition-all duration-500 shadow-2xl bg-surface-container flex flex-col justify-end"
            >
              {/* Imagem com posicionamento ajustado ao topo/centro para garantir enquadramento perfeito */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index < 2}
              />
              
              {/* Gradiente de proteção para leitura de texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              {/* Badge da Categoria no Canto Superior Esquerdo */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-primary/40 text-primary text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">stars</span>
                  {item.category}
                </span>
              </div>

              {/* Ícone de Zoom no Canto Superior Direito */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:border-primary group-hover:text-primary transition-all shadow-md">
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                </div>
              </div>

              {/* Conteúdo Informativo na Parte Inferior */}
              <div className="relative z-10 p-5 sm:p-7">
                <h3 className="font-geist text-lg sm:text-2xl font-bold text-white mb-1.5 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="font-inter text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  <span>Ver foto completa</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Faixa de Estatísticas de Impacto */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl glass-card border border-white/10 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-geist">100%</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 font-semibold">Presencial & Imersivo</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary font-geist">+100</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 font-semibold">Personais Impactados</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-geist">High Level</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 font-semibold">Networking Selecionado</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary font-geist">Zero Encheção</div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 font-semibold">Método 100% Prático</div>
          </div>
        </div>

        {/* CTA Button */}
        {onOpenCheckout && (
          <div className="mt-10 text-center">
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] text-black font-geist uppercase tracking-widest py-4 px-9 rounded-full font-black text-sm sm:text-base shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.65)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl">event_available</span>
              GARANTIR MINHA VAGA NA PRÓXIMA EDIÇÃO
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal com Exibição Completa Sem Cortar (object-contain) */}
      {activeImage !== null && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Header do Modal */}
          <div
            className="flex items-center justify-between w-full max-w-6xl mx-auto z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
                {activeImage.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {selectedIndex + 1} / {maestroGallery.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedIndex(null)}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-primary hover:text-black text-white flex items-center justify-center transition-all duration-200"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Imagem Central em Tamanho Inteiro Sem Cortes (object-contain) */}
          <div
            className="relative max-w-5xl w-full mx-auto flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Anterior */}
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === null || prev === 0 ? maestroGallery.length - 1 : prev - 1
                )
              }
              className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
              aria-label="Imagem Anterior"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            {/* Imagem Ampliada */}
            <div className="relative max-h-[70vh] w-full h-[65vh] flex items-center justify-center">
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                fill
                className="object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Botão Próximo */}
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === null || prev === maestroGallery.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
              aria-label="Próxima Imagem"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>

          {/* Legenda e Miniaturas */}
          <div
            className="max-w-4xl w-full mx-auto z-20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-geist text-lg sm:text-2xl font-bold text-white mb-1">
              {activeImage.title}
            </h3>
            <p className="font-inter text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto mb-4">
              {activeImage.description}
            </p>

            {/* Carrossel de Miniaturas */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
              {maestroGallery.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    i === selectedIndex
                      ? "border-primary scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.title} fill className="object-cover object-top" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
