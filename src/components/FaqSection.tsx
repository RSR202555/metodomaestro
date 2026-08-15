"use client";

import React, { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqCol1: FaqItem[] = [
  {
    question: "Para quem é a Aula Maestro?",
    answer: "Para personal trainers e estudantes de Educação Física que querem aprender a transformar conhecimento técnico em uma aula mais clara, organizada, segura e bem conduzida.",
  },
  {
    question: "Preciso já trabalhar como personal trainer?",
    answer: "Não. Se você ainda é estudante ou está começando na profissão, a Aula Maestro ajuda a construir desde cedo uma forma mais consciente de conduzir alunos. Se já trabalha como personal, poderá aplicar os conceitos imediatamente nas suas aulas.",
  },
  {
    question: "A Aula Maestro é um curso de biomecânica ou prescrição?",
    answer: "Não. Biomecânica, anatomia e prescrição fazem parte da formação do professor, mas não são o foco aqui. A Aula Maestro organiza outra competência: como conduzir um aluno durante os 60 minutos de aula.",
  },
  {
    question: "O treinamento é presencial?",
    answer: "Sim. A Aula Maestro foi construída como uma experiência presencial, com explicações, demonstrações, situações práticas e discussão sobre o que acontece de verdade durante uma aula.",
  },
  {
    question: "O que vou aprender?",
    answer: "Você vai aprender a organizar o ambiente da aula, compreender melhor o movimento do aluno, interpretar as exigências dos exercícios, intervir quando necessário e tomar decisões ao longo dos 60 minutos.",
  },
];

const faqCol2: FaqItem[] = [
  {
    question: "Vou aprender exercícios novos?",
    answer: "Esse não é o objetivo. A proposta não é aumentar sua lista de exercícios, mas mudar a forma como você observa, ensina, ajusta e conduz os exercícios que já utiliza.",
  },
  {
    question: "Tem certificado?",
    answer: "Sim. Os participantes recebem certificado de participação da Aula Maestro™.",
  },
  {
    question: "Qual a duração?",
    answer: "A experiência presencial tem aproximadamente 3 horas de duração, organizadas em blocos que constroem progressivamente a lógica da condução de uma aula.",
  },
  {
    question: "Onde acontece?",
    answer: "A Aula Maestro acontece presencialmente. O endereço e todas as orientações de acesso são informados aos participantes na confirmação da inscrição.",
  },
  {
    question: "E se eu ainda tiver alguma dúvida?",
    answer: "Você pode falar diretamente com nosso suporte. Nossa equipe pode ajudar com dúvidas sobre inscrição, local, horário ou qualquer informação relacionada ao treinamento.",
  },
];

export default function FaqSection() {
  const [openLeft, setOpenLeft] = useState<number | null>(null);
  const [openRight, setOpenRight] = useState<number | null>(null);

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/5500000000000?text=Ol%C3%A1!%20Tenho%20d%C3%BAvidas%20sobre%20a%20Aula%20Maestro.",
      "_blank"
    );
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-8 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-geist text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight text-white uppercase">
            AINDA FICOU ALGUMA DÚVIDA?
          </h2>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-12">
          {/* Column 1 */}
          <div className="space-y-3">
            {faqCol1.map((item, idx) => {
              const isOpen = openLeft === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenLeft(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-4 sm:p-5 text-sm sm:text-base font-semibold text-white/90 hover:text-primary transition-colors"
                  >
                    <span className="pr-4">{item.question}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/40 group-hover:text-primary flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 font-inter text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            {faqCol2.map((item, idx) => {
              const isOpen = openRight === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenRight(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-4 sm:p-5 text-sm sm:text-base font-semibold text-white/90 hover:text-primary transition-colors"
                  >
                    <span className="pr-4">{item.question}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/40 group-hover:text-primary flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 font-inter text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Support Button */}
        <div className="text-center">
          <button
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2.5 bg-transparent border border-white/20 hover:border-white/50 text-white font-geist font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>FALAR COM SUPORTE</span>
          </button>
        </div>
      </div>
    </section>
  );
}

