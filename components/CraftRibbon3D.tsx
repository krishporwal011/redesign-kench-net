"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CraftRibbon3D() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    function render() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const numRings = 16;
      const radiusBase = Math.min(canvas.width, canvas.height) * 0.28;

      // Draw rotating extruded spiral ribbon of bangle rings
      for (let i = 0; i < numRings; i++) {
        const offset = i * 0.28;
        const currentAngle = angle + offset;
        const r = radiusBase + Math.sin(currentAngle * 2) * 12;
        const x = cx + Math.cos(currentAngle) * (r * 0.8);
        const y = cy + Math.sin(currentAngle) * (r * 0.4) + (i - numRings / 2) * 4;

        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.7, r * 0.35, Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 ? "rgba(212, 175, 55, 0.85)" : "rgba(140, 28, 43, 0.75)";
        ctx.lineWidth = i % 4 === 0 ? 3.5 : 2;
        ctx.stroke();
      }

      angle += 0.015;
      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="my-12 kn-card p-5 sm:p-6 border-[#e4d9c9] bg-[#fffdf9] overflow-hidden">
      <div className="text-center max-w-xl mx-auto">
        <span className="kn-badge kn-badge-gold uppercase tracking-wider text-xs">
          {hi ? "तकनीकी एकत्रीकरण" : "The Science of Aggregation"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210] mt-1">
          {hi ? "घरेलू बंडलों की त्रि-आयामी श्रृंखला" : "Extruded Craft Ribbon Engine"}
        </h2>
        <p className="text-xs sm:text-sm text-[#523a2f] mt-1">
          {hi
            ? "बिना किसी गुणवत्ता समझौते के छोटे घरेलू बंडल बड़े थोक ऑर्डर में एकीकृत होते हैं।"
            : "Continuous rule-based spec verification combining individual household piles into one seamless lot."}
        </p>
      </div>

      <div className="mt-6 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-full overflow-hidden flex justify-center">
          <canvas
            ref={canvasRef}
            width={440}
            height={240}
            className="w-full max-w-[440px] h-auto cursor-pointer"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs font-bold w-full">
          <button
            type="button"
            onClick={() => setActiveStep(0)}
            className={`px-3 py-2 min-h-[44px] rounded-lg transition flex items-center justify-center ${
              activeStep === 0 ? "bg-[#8c1c2b] text-white" : "bg-[#f3ebdE] text-[#523a2f]"
            }`}
          >
            {hi ? "1. बंडल इनपुट" : "1. Micro-piles (200-500 pcs)"}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`px-3 py-2 min-h-[44px] rounded-lg transition flex items-center justify-center ${
              activeStep === 1 ? "bg-[#8c1c2b] text-white" : "bg-[#f3ebdE] text-[#523a2f]"
            }`}
          >
            {hi ? "2. स्पेक जाँच" : "2. Spec Matching Engine"}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`px-3 py-2 min-h-[44px] rounded-lg transition flex items-center justify-center ${
              activeStep === 2 ? "bg-[#2e7d5b] text-white" : "bg-[#f3ebdE] text-[#523a2f]"
            }`}
          >
            {hi ? "3. एस्क्रो लॉट" : "3. Escrow Buyer Lot"}
          </button>
        </div>
      </div>
    </section>
  );
}
