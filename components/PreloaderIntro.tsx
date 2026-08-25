"use client";

import { useEffect, useState } from "react";

export default function PreloaderIntro() {
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    // Dismiss preloader after animation completes
    const timer1 = setTimeout(() => setAnimating(false), 1400);
    const timer2 = setTimeout(() => setVisible(false), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#4a0e12] text-[#fbf3e7] transition-opacity duration-400 pointer-events-none ${
        animating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background Spotlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)]" />

      {/* Animated Wordmark Split */}
      <div className="relative z-10 flex items-center gap-3 font-serif">
        <span
          className="text-4xl sm:text-6xl font-black tracking-tight text-[#fbf3e7] inline-block animate-[preloader-split-left_1s_ease-out]"
        >
          Kanch
        </span>

        {/* Bangle Ring Mask Accent */}
        <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-4 border-[#d4af37] bg-[#8c1c2b] flex items-center justify-center text-lg sm:text-2xl font-bold shadow-lg">
          क
        </div>

        <span
          className="text-4xl sm:text-6xl font-black tracking-tight text-[#d4af37] inline-block animate-[preloader-split-right_1s_ease-out]"
        >
          Net
        </span>
      </div>

      <div className="absolute bottom-10 text-xs font-mono tracking-widest text-[#d4af37]/80 uppercase">
        Firozabad Glass Household Aggregation Network
      </div>
    </div>
  );
}
