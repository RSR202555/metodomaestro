"use client";

import React from "react";

interface MobileBottomNavProps {
  onOpenCheckout: () => void;
}

export default function MobileBottomNav({ onOpenCheckout }: MobileBottomNavProps) {
  const openWhatsApp = () => {
    window.open(
      "https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20suporte%20sobre%20o%20M%C3%A9todo%20Maestro.",
      "_blank"
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 rounded-t-2xl bg-background/90 backdrop-blur-xl border-t border-primary/30 shadow-[0_-10px_40px_rgba(212,175,55,0.2)] flex justify-around items-center h-20 px-4 pb-safe">
      <button
        onClick={onOpenCheckout}
        className="bg-primary text-on-primary rounded-full px-6 py-3 font-geist font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 animate-pulse-subtle w-full max-w-[230px]"
      >
        <span className="material-symbols-outlined text-lg">
          confirmation_number
        </span>
        <span>Garantir Meu Bilhete</span>
      </button>

      <button
        onClick={openWhatsApp}
        className="text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center justify-center gap-1 font-geist text-xs py-1"
      >
        <span className="material-symbols-outlined text-xl">support_agent</span>
        <span>Suporte</span>
      </button>
    </nav>
  );
}
