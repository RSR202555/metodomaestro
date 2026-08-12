"use client";

import React from "react";

export default function CinematicTransition() {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-4 sm:px-6 py-20 bg-black relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/15 via-transparent to-transparent opacity-60"></div>
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-geist text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight text-white mb-6">
          O problema nunca foi falta de capacidade.
        </h2>
        <p className="font-geist text-xl sm:text-2xl text-primary font-light tracking-wide">
          O problema foi nunca terem ensinado você a construir um negócio.
        </p>
      </div>
    </section>
  );
}
