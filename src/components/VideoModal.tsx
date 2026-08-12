"use client";

import React from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#101010] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 bg-[#181818] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            <span className="font-geist text-sm sm:text-base font-bold text-white">
              Método Maestro - Apresentação Oficial com Filipe Aquino
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors"
            aria-label="Fechar vídeo"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Video Container (Responsive Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Apresentação Método Maestro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
