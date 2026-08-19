"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CountdownTimer from "@/components/CountdownTimer";
import EventDetailsSection from "@/components/EventDetailsSection";
import ProblemSection from "@/components/ProblemSection";
import ActionSection from "@/components/ActionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import VideoModal from "@/components/VideoModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import MouseSpotlight from "@/components/MouseSpotlight";

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black relative overflow-x-hidden">
      {/* Interactive Cursor Spotlight */}
      <MouseSpotlight />

      {/* 1. Header */}
      <Header onOpenCheckout={openCheckout} />

      {/* Main Interactive Content */}
      <main className="relative z-10 space-y-4">
        {/* 2. Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <HeroSection onOpenVideo={openVideo} onOpenCheckout={openCheckout} />
        </motion.div>

        {/* 3. Scarcity Countdown Timer Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="px-4"
        >
          <CountdownTimer />
        </motion.div>

        {/* 4. Event Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <EventDetailsSection />
        </motion.div>

        {/* 5. Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <ProblemSection />
        </motion.div>


        {/* 7. Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <ActionSection onOpenCheckout={openCheckout} />
        </motion.div>


        {/* 9. Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <TestimonialsSection onOpenCheckout={openCheckout} />
        </motion.div>

        {/* 10. Interactive FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <FaqSection />
        </motion.div>

        {/* 11. Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <FinalCTASection onOpenCheckout={openCheckout} />
        </motion.div>
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Interactive Modals & Floating Nav */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
      <VideoModal isOpen={isVideoOpen} onClose={closeVideo} />
      <MobileBottomNav onOpenCheckout={openCheckout} />
    </div>
  );
}
