"use client";

import React from "react";
import { TrendingDown, Banknote, Hourglass } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: TrendingDown,
      title: "Poucos alunos",
      description: "Agenda vazia e dependência de indicações aleatórias. Falta previsibilidade no final do mês.",
      highlight: false,
      color: "error",
    },
    {
      icon: Banknote,
      title: "Baixo faturamento",
      description: "Cobrando menos do que vale por medo de perder o cliente para a concorrência desleal.",
      highlight: true,
      color: "primary",
    },
    {
      icon: Hourglass,
      title: "Escravo da hora-aula",
      description: "Trabalhando 14 horas por dia nas academias, sem tempo para viver e limitado pelo relógio.",
      highlight: false,
      color: "error",
    },
  ];

  return (
    <section id="problemas" className="py-20 px-4 sm:px-6 bg-background relative border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-geist text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-white">
            O ciclo da exaustão
          </h2>
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-lg mx-auto">
            Se você não está faturando o que merece, você está preso em um destes três pilares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, idx) => {
            const IconComp = problem.icon;
            return (
              <div
                key={idx}
                className={`glass-card rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group border ${
                  problem.highlight
                    ? "border-primary/40 gold-glow"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                    problem.color === "primary"
                      ? "bg-primary-container/20 border-primary/30 text-primary"
                      : "bg-error-container/20 border-error/20 text-error"
                  }`}
                >
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="font-geist text-xl font-semibold mb-3 text-white">
                  {problem.title}
                </h3>
                <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
