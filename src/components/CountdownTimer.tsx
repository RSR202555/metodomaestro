"use client";

import React, { useState, useEffect } from "react";

export default function CountdownTimer() {
  // Set default countdown to 12 hours from current load or fixed target
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 58,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-primary-container/20 via-primary/10 to-primary-container/20 border border-primary/30 rounded-2xl p-4 md:p-6 max-w-xl mx-auto mb-8 text-center backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <span>LOTE 1 COM VALOR PROMOCIONAL ENCERRA EM:</span>
      </div>

      <div className="flex justify-center items-center gap-3 sm:gap-6 text-white font-geist">
        <div className="flex flex-col items-center">
          <div className="bg-[#181818] border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 font-extrabold text-xl sm:text-3xl text-primary shadow-inner">
            {formatNumber(timeLeft.hours)}
          </div>
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase mt-1">Horas</span>
        </div>

        <span className="text-xl sm:text-2xl font-bold text-primary-container">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-[#181818] border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 font-extrabold text-xl sm:text-3xl text-primary shadow-inner">
            {formatNumber(timeLeft.minutes)}
          </div>
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase mt-1">Minutos</span>
        </div>

        <span className="text-xl sm:text-2xl font-bold text-primary-container">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-[#181818] border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 font-extrabold text-xl sm:text-3xl text-primary shadow-inner">
            {formatNumber(timeLeft.seconds)}
          </div>
          <span className="text-[10px] sm:text-xs text-on-surface-variant uppercase mt-1">Segundos</span>
        </div>
      </div>
    </div>
  );
}
