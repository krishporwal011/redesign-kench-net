"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function CollageSection() {
  const { language } = useLanguage();
  const hi = language === "hi";

  return (
    <section className="my-12 py-10 px-4 sm:px-6 rounded-3xl bg-[#f7e7ce] border border-[#e4d9c9] overflow-hidden">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Story Copy */}
        <div className="lg:col-span-6 space-y-4">
          <span className="kn-badge kn-badge-gold uppercase tracking-wider text-xs">
            {hi ? "हस्तनिर्मित विरासत व प्रमाणिकता" : "Authentic Craftsmanship"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1210] leading-tight">
            {hi ? "घर-घर में निर्मित," : "Crafted in Homes,"} <br />
            <span className="text-[#8c1c2b]">
              {hi ? "मंडी से थोक में जुड़ा।" : "Unified for Wholesale Mandi."}
            </span>
          </h2>
          <p className="text-sm text-[#523a2f] leading-relaxed">
            {hi
              ? "फिरोजाबाद के रामनगर, सुहाग नगर व उसैनी के घरेलू कारीगर हर दिन 200–500 नग काँच की चूड़ियाँ बनाते हैं। काँच-नेट इन सूक्ष्म बंडलों को गुणवत्ता जाँच के बाद थोक मंडी के बड़े ऑर्डरों में जोड़ता है।"
              : "Every day, artisan families in Ramnagar, Suhag Nagar, and Usaini produce hand-crafted glass bangles in micro-piles of 200–500 pieces. Kanch-Net aggregates these verified piles into wholesale buyer lots with guaranteed spec matching."}
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/70 border border-[#e4d9c9]">
              <span className="text-lg font-black text-[#8c1c2b] block font-mono">10,000+</span>
              <span className="text-[#523a2f] font-semibold">
                {hi ? "दैनिक नग क्षमता" : "Daily Pieces Aggregated"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[#e4d9c9]">
              <span className="text-lg font-black text-[#2e7d5b] block font-mono">100%</span>
              <span className="text-[#523a2f] font-semibold">
                {hi ? "गुणवत्ता व एस्क्रो सुरक्षा" : "Spec Match & Escrow Secure"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Overlapping Photo Collage Deck */}
        <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] flex items-center justify-center">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-[#d4af37]/20 to-transparent blur-xl" />

          {/* Photo Card 1: Bangle Sorting Floor */}
          <div className="absolute left-2 sm:left-6 top-4 w-52 sm:w-64 p-3 rounded-2xl bg-white shadow-md border border-[#e4d9c9] -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="h-32 sm:h-40 rounded-xl bg-[#4a0e12] p-3 flex flex-col justify-between text-[#fbf3e7]">
              <span className="kn-badge kn-badge-gold text-[10px] self-start">Ramnagar Hub</span>
              <div className="space-y-1">
                <span className="text-xs font-bold block">🔴 Ruby Red Bangles</span>
                <span className="text-[11px] text-[#d4af37] font-mono">HH-01 · 450 pcs</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-bold text-[#1a1210] text-center">
              {hi ? "1. बंडल एकत्रीकरण" : "1. Micro-pile Sorting"}
            </p>
          </div>

          {/* Photo Card 2: Boxed Stock Packaging (Overlapping Deck) */}
          <div className="absolute right-2 sm:right-6 bottom-4 w-56 sm:w-68 p-3 rounded-2xl bg-white shadow-lg border-2 border-[#8c1c2b] rotate-2 hover:rotate-0 transition-transform duration-300 z-10">
            <div className="h-36 sm:h-44 rounded-xl bg-[#fdf0f0] p-3 flex flex-col justify-between border border-[#8c1c2b]/20">
              <div className="flex items-center justify-between">
                <span className="kn-badge kn-badge-success text-[10px]">Verified QC</span>
                <span className="text-xs font-mono font-bold text-[#8c1c2b]">ORD-001</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e4d9c9] text-xs">
                <span className="font-bold text-[#1a1210] block">Wholesale Buyer Lot</span>
                <span className="text-[11px] text-[#2e7d5b] font-bold">5,680 / 10,000 matched</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-bold text-[#8c1c2b] text-center">
              {hi ? "2. थोक मंडी पूर्ति" : "2. Wholesale Boxed Lot"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
