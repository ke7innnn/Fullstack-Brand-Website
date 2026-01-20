"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Products from "@/components/Products";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import StoreLocator from "@/components/StoreLocator";
import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import IntroOverlay from "@/components/IntroOverlay";

export default function Home() {
  // Start as true (finished) to prevent flashing on return visits. 
  // We will check sessionStorage in useEffect to decide if we need to show it.
  const [introFinished, setIntroFinished] = useState(true);

  useEffect(() => {
    // Check if user has seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setIntroFinished(false); // Enable intro for new session
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setIntroFinished(true);
  };

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <AnimatePresence>
        {!introFinished && (
          <IntroOverlay onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div id="home">
        <Header />
        {/* Scroll Sequence Section */}
        <div className="relative">
          <ScrollyCanvas frameCount={160} />
          <Overlay />
        </div>
      </div>

      {/* Content Sections */}
      <Products />
      <AboutSection />
      <CTA />
      <BlogSection />
      <StoreLocator />

      {/* Footer / Credits */}
      <Footer />
    </main>
  );
}
