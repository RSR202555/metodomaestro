"use client";

import React, { useRef, useEffect } from "react";
import { PlayCircle, X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy until user interacts
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#0D0D0D] border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-[#141414] border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <PlayCircle className="w-5 h-5 text-primary" />
            <span className="font-geist text-sm sm:text-base font-bold text-white">
              Método Maestro - Anúncio Oficial com Filipe Aquino
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Fechar vídeo"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src="/imagens/ANUNCIO%20MAESTRO.mp4"
            poster="/imagens/aquino01.jpg.jpeg"
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
