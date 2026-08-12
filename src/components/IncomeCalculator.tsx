"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface IncomeCalculatorProps {
  onOpenCheckout: () => void;
}

export default function IncomeCalculator({ onOpenCheckout }: IncomeCalculatorProps) {
  const [students, setStudents] = useState<number>(12);
  const [currentRate, setCurrentRate] = useState<number>(80);

  // Current Monthly Income (Assuming 12 hours per student per month)
  const currentIncome = students * currentRate * 12;

  // Método Maestro Potential (Repositioning to high ticket + online consulting = 2.8x multiplier)
  const potentialIncome = Math.round(currentIncome * 2.8);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#0B0B0B] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="bg-primary/10 border border-primary/30 text-primary text-xs uppercase font-bold tracking-widest px-4 py-1.5 rounded-full">
            SIMULADOR EXCLUSIVO
          </span>
          <h2 className="font-geist text-3xl sm:text-5xl font-bold tracking-tight text-white mt-4 mb-4">
            Quanto Você Deveria Estar Faturando?
          </h2>
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">
            Simule o potencial financeiro da sua carreira ao aplicar as técnicas de posicionamento premium do Método Maestro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Number of Students */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-white font-geist">
                  Número de Alunos Presenciais
                </label>
                <span className="text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                  {students} alunos
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="35"
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full h-2 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-on-surface-variant/60 mt-1">
                <span>3 alunos</span>
                <span>35 alunos</span>
              </div>
            </div>

            {/* Slider 2: Current Hourly Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-white font-geist">
                  Valor Atual da Sua Hora-Aula
                </label>
                <span className="text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                  R$ {currentRate}/h
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="250"
                step="5"
                value={currentRate}
                onChange={(e) => setCurrentRate(Number(e.target.value))}
                className="w-full h-2 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-on-surface-variant/60 mt-1">
                <span>R$ 40/h</span>
                <span>R$ 250/h</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-[#1c1c1c] border border-primary/30 gold-glow rounded-2xl p-6 text-center space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">
                Faturamento Atual Estimado:
              </span>
              <p className="text-xl font-bold text-white/70 mt-1">
                {formatCurrency(currentIncome)} /mês
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                POTENCIAL COM MÉTODO MAESTRO:
              </span>
              <motion.p
                key={potentialIncome}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-extrabold font-geist text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-primary-fixed mt-1"
              >
                {formatCurrency(potentialIncome)} <span className="text-sm font-normal text-white">/mês</span>
              </motion.p>
              <p className="text-xs text-green-400 font-semibold mt-2 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +180% de aumento estimado de faturamento
              </p>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full bg-primary text-on-primary font-geist font-bold text-xs uppercase tracking-widest py-4 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(212,175,55,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              ALCANÇAR ESTE RESULTADO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
