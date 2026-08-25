"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function GlassmorphicStage() {
  const { language } = useLanguage();
  const hi = language === "hi";

  return (
    <section className="my-12 relative p-6 sm:p-10 rounded-3xl bg-[#4a0e12] text-[#fbf3e7] overflow-hidden border border-[#d4af37]/30 shadow-xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Emeral Payoff Accent Pill */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e7d5b] text-white text-xs font-extrabold uppercase tracking-wider">
            🛡️ {hi ? "100% एस्क्रो व गोपनीयता सुरक्षा" : "100% Verified & Escrow Guaranteed"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fbf3e7] mt-3">
            {hi ? "काँच क्राफ्ट का भरोसेमंद नेटवर्क" : "Firozabad's Trusted Craft Network"}
          </h2>
          <p className="text-xs sm:text-sm text-[#fbf3e7]/80 mt-1 max-w-xl">
            {hi
              ? "कारीगरों के फोन नंबर व व्यक्तिगत जानकारी गुप्त रखी जाती है (केवल परिवार आईडी प्रदर्शित)। भुगतान कलेक्टर जाँच के तुरंत बाद एस्क्रो से रिहा होता है।"
              : "Artisan family privacy protected with Household IDs. Advance booking deposits locked in escrow and released immediately upon Collector QC inspection."}
          </p>
        </div>

        <Link
          href="/matching"
          className="kn-btn-gold text-sm font-extrabold px-6 py-3 shrink-0"
        >
          {hi ? "स्पेक मिलान इंजन देखें ➔" : "Explore Matching Engine ➔"}
        </Link>
      </div>

      {/* Glassmorphic Info Card Deck */}
      <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kn-glass-card-dark p-4 font-mono">
          <span className="text-2xl font-black text-[#d4af37] block">ORD-001</span>
          <span className="text-xs text-white/90 font-sans font-extrabold mt-1 block">
            {hi ? "खरीदार ऑर्डर पूर्ति" : "Buyer Wholesale Demand"}
          </span>
          <span className="text-[11px] text-[#2e7d5b] font-sans font-bold mt-0.5 block">
            5,680 / 10,000 {hi ? "नग मिलान" : "matched"}
          </span>
        </div>

        <div className="kn-glass-card-dark p-4 font-mono">
          <span className="text-2xl font-black text-[#d4af37] block">16 Piles</span>
          <span className="text-xs text-white/90 font-sans font-extrabold mt-1 block">
            {hi ? "योग्य बंडल" : "Qualified Household Piles"}
          </span>
          <span className="text-[11px] text-white/70 font-sans font-bold mt-0.5 block">
            Ramnagar & Suhag Nagar
          </span>
        </div>

        <div className="kn-glass-card-dark p-4 font-mono">
          <span className="text-2xl font-black text-[#2e7d5b] block">₹45,440</span>
          <span className="text-xs text-white/90 font-sans font-extrabold mt-1 block">
            {hi ? "सुरक्षित एस्क्रो राशि" : "Escrow Secured Payout"}
          </span>
          <span className="text-[11px] text-white/70 font-sans font-bold mt-0.5 block">
            ₹8/pc artisan base rate
          </span>
        </div>
      </div>
    </section>
  );
}
