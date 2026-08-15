"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventDetailsSection from "@/components/EventDetailsSection";
import ProblemSection from "@/components/ProblemSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ActionSection from "@/components/ActionSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import VideoModal from "@/components/VideoModal";

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      {/* 1. Header */}
      <Header onOpenCheckout={openCheckout} />

      {/* Main Content (Seção por Seção idêntico ao print) */}
      <main>
        {/* 2. Hero Section */}
        <HeroSection onOpenVideo={openVideo} onOpenCheckout={openCheckout} />

        {/* 3. Event Details Section (Data, Local, Horários) */}
        <EventDetailsSection />

        {/* 4. Problem Section (O problema nunca foi falta de conhecimento técnico) */}
        <ProblemSection />

        {/* 5. Testimonials Section (Profissionais já estão começando a enxergar...) */}
        <TestimonialsSection onOpenCheckout={openCheckout} />

        {/* 6. Action Section (A Aula Maestro em Ação) */}
        <ActionSection onOpenCheckout={openCheckout} />

        {/* 7. Faq Section (Ainda ficou alguma dúvida?) */}
        <FaqSection />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Interactive Modals */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
      <VideoModal isOpen={isVideoOpen} onClose={closeVideo} />
    </div>
  );
}

