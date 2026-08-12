"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventDetailsSection from "@/components/EventDetailsSection";
import ProblemSection from "@/components/ProblemSection";
import CinematicTransition from "@/components/CinematicTransition";
import TestimonialsSection from "@/components/TestimonialsSection";
import SocialProofGallery from "@/components/SocialProofGallery";
import FaqSection from "@/components/FaqSection";
import FinalCTASection from "@/components/FinalCTASection";
import MobileBottomNav from "@/components/MobileBottomNav";
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
    <div className="min-h-screen bg-background text-on-background">
      {/* Header */}
      <Header onOpenCheckout={openCheckout} />

      {/* Main Content */}
      <main className="pb-24 md:pb-0">
        <HeroSection onOpenVideo={openVideo} onOpenCheckout={openCheckout} />
        <EventDetailsSection />
        <ProblemSection />
        <CinematicTransition />
        <TestimonialsSection onOpenCheckout={openCheckout} />
        <SocialProofGallery onOpenCheckout={openCheckout} />
        <FaqSection />
        <FinalCTASection onOpenCheckout={openCheckout} />
      </main>

      {/* Mobile Fixed Navigation Bar */}
      <MobileBottomNav onOpenCheckout={openCheckout} />

      {/* Interactive Modals */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
      <VideoModal isOpen={isVideoOpen} onClose={closeVideo} />
    </div>
  );
}
