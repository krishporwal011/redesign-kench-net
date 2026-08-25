"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

type PileItem = {
  id: string;
  household: string;
  locality: string;
  qty: number;
  colour: "ruby_red" | "blue";
};

const SAMPLE_PILES: PileItem[] = [
  { id: "P-1", household: "HH-01 (Ramesh)", locality: "Ramnagar", qty: 450, colour: "ruby_red" },
  { id: "P-2", household: "HH-02 (Suresh)", locality: "Suhag Nagar", qty: 500, colour: "ruby_red" },
  { id: "P-3", household: "HH-03 (Imran)", locality: "Ramnagar", qty: 300, colour: "blue" },
  { id: "P-4", household: "HH-04 (Sunita)", locality: "Prem Nagar", qty: 400, colour: "ruby_red" },
  { id: "P-5", household: "HH-05 (Kalpana)", locality: "Suhag Nagar", qty: 600, colour: "ruby_red" },
  { id: "P-6", household: "HH-06 (Aslam)", locality: "Ramnagar", qty: 550, colour: "ruby_red" },
  { id: "P-7", household: "HH-07 (Meena)", locality: "Usaini", qty: 480, colour: "ruby_red" },
  { id: "P-8", household: "HH-08 (Vikas)", locality: "Prem Nagar", qty: 520, colour: "ruby_red" },
];

export default function AggregationVisualizer() {
  const { language } = useLanguage();
  const [step, setStep] = useState<number>(0);
  const [isAuto, setIsAuto] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuto) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3600);
    return () => clearInterval(interval);
  }, [isAuto]);

  const redPiles = SAMPLE_PILES.filter((p) => p.colour === "ruby_red");
  const totalRedQty = redPiles.reduce((acc, p) => acc + p.qty, 0);

  const hi = language === "hi";

  return (
    <div className="kn-card p-4 sm:p-6 my-6 border-[#e4d9c9] bg-[#fdf8f4] shadow-md overflow-hidden">
      {/* Header / Concept Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4d9c9] pb-4">
        <div>
          <span className="kn-badge kn-badge-gold uppercase tracking-wider text-[11px]">
            {hi ? "आर्किटेक्चर विवरण" : "Core Architecture"}
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#1a1210]">
            {hi ? "एकत्रित आपूर्ति नेटवर्क" : "Aggregated Supply Network"}
          </h2>
          <p className="text-xs sm:text-sm text-[#785d4f]">
            {hi
              ? "छोटे घरेलू बंडल कैसे थोक खरीदार के बड़े ऑर्डर बनाते हैं"
              : "How small household piles stack & combine into wholesale buyer lots"}
          </p>
        </div>

        {/* Responsive Step Navigation Bar */}
        <div className="flex gap-1 bg-[#f3e5d5] p-1 rounded-xl text-xs font-bold overflow-x-auto max-w-full no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setIsAuto(false);
              setStep(0);
            }}
            className={`px-3 py-1.5 min-h-[36px] whitespace-nowrap rounded-lg transition ${
              step === 0 ? "bg-[#790f26] text-white shadow-xs" : "text-[#523a2f]"
            }`}
          >
            {hi ? "1. बंडल" : "1. Piles"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuto(false);
              setStep(1);
            }}
            className={`px-3 py-1.5 min-h-[36px] whitespace-nowrap rounded-lg transition ${
              step === 1 ? "bg-[#790f26] text-white shadow-xs" : "text-[#523a2f]"
            }`}
          >
            {hi ? "2. पूल" : "2. Aggregate"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuto(false);
              setStep(2);
            }}
            className={`px-3 py-1.5 min-h-[36px] whitespace-nowrap rounded-lg transition ${
              step === 2 ? "bg-[#790f26] text-white shadow-xs" : "text-[#523a2f]"
            }`}
          >
            {hi ? "3. मिलान" : "3. Match"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuto(false);
              setStep(3);
            }}
            className={`px-3 py-1.5 min-h-[36px] whitespace-nowrap rounded-lg transition ${
              step === 3 ? "bg-[#790f26] text-white shadow-xs" : "text-[#523a2f]"
            }`}
          >
            {hi ? "4. ऑर्डर" : "4. Order"}
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="mt-5 relative min-h-[260px] bg-[#faf0e4] rounded-2xl border border-[#e4d9c9] p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
        {/* STEP 0: Fanned-out Household Pile Cards */}
        {step === 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">
                {hi
                  ? "चरण 1: घरेलू सूक्ष्म-बंडल (फैन-आउट दृश्य)"
                  : "Step 1: Household Micro-Piles (Fanned Out)"}
              </span>
              <span className="text-xs font-bold text-[#790f26] font-mono">
                {SAMPLE_PILES.length} {hi ? "परिवार दर्ज" : "Households Active"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {SAMPLE_PILES.map((pile, idx) => (
                <motion.div
                  key={pile.id}
                  initial={{ opacity: 0, y: 15, rotate: (idx % 2 === 0 ? 1 : -1) * 1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="bg-[#fdf8f4] p-2.5 rounded-xl border border-[#e4d9c9] shadow-sm flex items-center gap-2"
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: pile.colour === "blue" ? "#1c466e" : "#790f26",
                  }}
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-[#1a1210] truncate">{pile.household}</p>
                    <p className="text-[11px] text-[#785d4f]">
                      {pile.qty} pcs · {pile.locality}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Genuine Stacked-Card Aggregation Visualization */}
        {step === 1 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">
                {hi
                  ? "चरण 2: सूक्ष्म-पूल एकत्रीकरण (स्टैक्ड डेक)"
                  : "Step 2: Micro-Pool Aggregation (Stacked Deck)"}
              </span>
              <span className="text-xs font-bold text-[#2e7d5b] animate-pulse">
                {hi ? "बंडल एकत्रीकरण चालू..." : "Collapsing into 1 Lot..."}
              </span>
            </div>

            {/* Stacked Card Deck Visualization */}
            <div className="relative h-44 flex items-center justify-center overflow-hidden">
              {SAMPLE_PILES.map((pile, idx) => {
                const isTop = idx === SAMPLE_PILES.length - 1;
                return (
                  <motion.div
                    key={pile.id}
                    initial={{
                      x: (idx - 4) * 30,
                      y: 0,
                      rotate: 0,
                    }}
                    animate={{
                      x: idx * 4,
                      y: idx * 5,
                      rotate: (idx - 4) * 0.7,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      delay: idx * 0.04,
                    }}
                    className="absolute w-[82vw] max-w-[310px] sm:w-80 p-3 sm:p-3.5 rounded-xl bg-[#fdf8f4] border border-[#e4d9c9] shadow-md text-left"
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: pile.colour === "blue" ? "#1c466e" : "#790f26",
                      zIndex: idx,
                      boxShadow: "0 2px 4px rgba(61,10,17,0.06), 0 8px 16px rgba(61,10,17,0.10)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`kn-dot ${pile.colour === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                        <span className="text-xs font-bold text-[#1a1210] truncate">{pile.household}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#790f26] shrink-0">
                        {pile.qty} pcs
                      </span>
                    </div>
                    {isTop && (
                      <div className="mt-2 pt-2 border-t border-[#e4d9c9] flex items-center justify-between text-[11px]">
                        <span className="text-[#785d4f] font-medium">Unified Locality Pool:</span>
                        <span className="font-bold text-[#2e7d5b]">
                          {totalRedQty.toLocaleString()} Ruby Red pcs
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Deterministic Matching */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-2.5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">
                {hi
                  ? "चरण 3: नियम-आधारित मिलान (सख्त गुणवत्ता शर्त)"
                  : "Step 3: Deterministic Matching (No Spec Compromise)"}
              </span>
              <span className="text-xs font-bold text-[#c9aa35]">{hi ? "गुणवत्ता जाँच" : "Spec Filtering"}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    {hi
                      ? `स्वीकृत लाल चूड़ी पूल (${totalRedQty.toLocaleString()} नग)`
                      : `Matching Red Pool (${totalRedQty.toLocaleString()} pcs)`}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Ruby Red · Size 2-6 · Plain Glossy · Grade B+
                  </p>
                </div>
              </div>
              <span className="kn-badge kn-badge-success shrink-0">{hi ? "स्वीकृत" : "MATCHED"}</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚫</span>
                <div>
                  <p className="text-xs font-bold text-rose-900">
                    {hi ? "नीला माल (300 नग)" : "Blue Stock (300 pcs)"}
                  </p>
                  <p className="text-[11px] text-rose-700">
                    {hi
                      ? "अस्वीकृत: रंग नीला है, खरीदार लाल चाहता है"
                      : "Rejected: Colour is Blue, buyer requested Ruby Red"}
                  </p>
                </div>
              </div>
              <span className="kn-badge kn-badge-error shrink-0">{hi ? "अस्वीकृत" : "REJECTED"}</span>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Wholesale Buyer Order Fulfillment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">
                {hi
                  ? "चरण 4: थोक खरीदार ऑर्डर पूर्ति (ORD-001)"
                  : "Step 4: Wholesale Order Fulfillment (ORD-001)"}
              </span>
              <span className="text-xs font-bold text-[#790f26]">
                {hi ? "पूर्ति प्रगति में" : "Demand Fulfilled"}
              </span>
            </div>

            <div className="bg-[#fdf8f4] p-3.5 sm:p-4 rounded-xl border-2 border-[#790f26] shadow-md">
              <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-2.5">
                <div>
                  <span className="text-xs font-bold font-mono text-[#790f26]">ORD-001</span>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1a1210]">
                    10,000 Ruby Red Bangles (Size 2-6)
                  </h4>
                </div>
                <span className="kn-badge kn-badge-success font-mono shrink-0">
                  5,680 / 10,000 {hi ? "नग मिलान" : "Matched"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-medium text-[#523a2f]">
                <span>
                  {hi ? "आपूर्तिकर्ता:" : "Supplier:"}{" "}
                  <strong className="text-[#1a1210]">
                    {hi ? "फिरोजाबाद कारीगर (एकत्रित)" : "Firozabad Households"}
                  </strong>
                </span>
                <span>
                  {hi ? "पूर्ति:" : "Fulfillment:"}{" "}
                  <strong className="text-[#790f26]">56.8% {hi ? "पूर्ण" : "Complete"}</strong>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar & Controls */}
        <div className="mt-4 pt-3 border-t border-[#e4d9c9] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i ? "w-6 bg-[#790f26]" : "w-1.5 bg-[#e4d9c9]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsAuto(!isAuto)}
            className="text-[#785d4f] hover:text-[#790f26] font-bold min-h-[44px] px-2 flex items-center"
          >
            {isAuto ? (hi ? "रोकें ⏸" : "Pause ⏸") : (hi ? "चलाएँ ▶" : "Play ▶")}
          </button>
        </div>
      </div>
    </div>
  );
}
