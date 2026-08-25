"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import starter from "@/data/starter-list.json";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import { colourWords, familyName } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import { matchPileToOrder, type OrderMatchFields } from "@/lib/match";
import { kmFromHub } from "@/lib/places";
import { loadPiles } from "@/lib/store";
import type { Pile } from "@/lib/types";

const order = starter.order;

const ORDER_FIELDS: OrderMatchFields = {
  productFamily: order.productFamily,
  size: order.size,
  colourFamily: order.colourFamily,
  colourName: order.colourName,
  finish: order.finish,
  finishName: order.finishName,
  minGrade: order.minGrade,
};

function lookWords(finish: string, lang: "en" | "hi") {
  if (finish === "plain_glossy") return lang === "hi" ? "Plain Glossy" : "Plain Glossy";
  if (finish === "matte") return lang === "hi" ? "Matte" : "Matte";
  return finish.replace(/_/g, " ");
}

function whyOut(pile: Pile, want: OrderMatchFields, lang: "en" | "hi"): string {
  const hi = lang === "hi";
  if (pile.productFamily !== want.productFamily) {
    return hi ? "उत्पाद काँच की चूड़ी नहीं है" : "Product is not glass bangles";
  }
  if (pile.size !== want.size) {
    return hi
      ? `साइज़ ${pile.size} है, खरीदार ${want.size} चाहता है`
      : `Size is ${pile.size}, buyer wants ${want.size}`;
  }
  if (pile.colourFamily !== want.colourFamily) {
    return hi
      ? `रंग ${colourWords(pile.colourFamily, "hi")} है, खरीदार ${colourWords(want.colourFamily, "hi")} चाहता है`
      : `Colour is ${colourWords(pile.colourFamily, "en")}, buyer wants ${colourWords(want.colourFamily, "en")}`;
  }
  if (pile.finish !== want.finish) {
    return hi
      ? `फिनिश ${lookWords(pile.finish, "hi")} है, खरीदार ${lookWords(want.finish, "hi")} चाहता है`
      : `Finish is ${lookWords(pile.finish, "en")}, buyer wants ${lookWords(want.finish, "en")}`;
  }
  return hi
    ? `ग्रेड ${pile.grade} है, खरीदार ${want.minGrade} या उससे बेहतर चाहता है`
    : `Grade is ${pile.grade}, buyer wants Grade ${want.minGrade} or better`;
}

// Animated Count Up Component for Running Totals
function CountUpNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 400; // ms
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.round(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [value]);

  return <span>{displayValue.toLocaleString("en-IN")}</span>;
}

export default function MatchingPage() {
  const { language, t } = useLanguage();
  const hi = language === "hi";
  const [piles, setPiles] = useState<Pile[] | null>(null);

  useEffect(() => {
    function refresh() {
      setPiles(loadPiles());
    }
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const { keep, cannot, matchedQty, remainingQty } = useMemo(() => {
    const list = piles ?? [];
    const keep: Pile[] = [];
    const cannot: Array<{ pile: Pile; reason: string }> = [];
    for (const pile of list) {
      const result = matchPileToOrder(pile, ORDER_FIELDS);
      if (result.ok) keep.push(pile);
      else cannot.push({ pile, reason: whyOut(pile, ORDER_FIELDS, language) });
    }
    keep.sort((a, b) => kmFromHub(a.locality) - kmFromHub(b.locality));
    const matchedQty = keep.reduce((sum, pile) => sum + pile.declaredQty, 0);
    const remainingQty = Math.max(0, order.quantityNeeded - matchedQty);
    return { keep, cannot, matchedQty, remainingQty };
  }, [piles, language]);

  return (
    <>
      <AppHeader />
      <NeedLogin>
        {() =>
          piles === null ? (
            <div className="p-8 text-center text-[#785d4f] text-xs">Loading...</div>
          ) : (
            <PageContainer className="pb-24">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210]">
                  {t("matching.title")}
                </h1>
                <p className="text-sm text-[#785d4f] mt-1">
                  {hi
                    ? "खरीदार ऑर्डर ORD-001 के लिए नियम-आधारित मिलान"
                    : "Rule-based pile matching for Buyer Order ORD-001"}
                </p>
              </div>

              {/* Order Requirement Summary */}
              <div className="kn-card p-6 sm:p-8 border-[#e4d9c9] bg-[#fdf8f4] mb-10 shadow-md">
                <div className="flex flex-wrap items-center justify-between border-b border-[#e4d9c9] pb-4 gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#790f26]">ORD-001</span>
                    <h2 className="text-lg font-bold text-[#1a1210]">
                      10,000 {hi ? "लाल काँच चूड़ियाँ" : "Red Glass Bangles"}
                    </h2>
                  </div>
                  <span className="kn-badge kn-badge-gold text-xs font-mono font-bold">
                    {order.size} · Ruby Red · Grade {order.minGrade}
                  </span>
                </div>

                {/* Animated Count-Up Running Totals */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 shadow-2xs">
                    <span className="text-[#19402e] font-semibold block text-xs">
                      {hi ? "मेल खाने वाले नग" : "Matched pieces"}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#19402e] mt-1 block">
                      <CountUpNumber value={matchedQty} />
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#fdf0f0] border border-[#ffcdd6] shadow-2xs">
                    <span className="text-[#8c1d1d] font-semibold block text-xs">
                      {hi ? "बाकी मात्रा" : "Remaining pieces"}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#8c1d1d] mt-1 block">
                      <CountUpNumber value={remainingQty} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Matching Piles Section: RESPONSIVE 2-COLUMN GRID */}
              <div className="space-y-10">
                <div className="kn-card p-6 sm:p-8 border-[#e4d9c9] bg-[#fdf8f4]">
                  <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-4 mb-6">
                    <h3 className="text-lg font-bold text-[#1a1210]">{t("matching.matchingPiles")}</h3>
                    <span className="kn-badge kn-badge-success text-xs font-mono px-3 py-1">{keep.length}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {keep.map((pile, idx) => (
                        <motion.div
                          key={pile.batchId}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(0.4, idx * 0.04) }}
                          className="p-4 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between text-xs shadow-xs hover:border-[#790f26] transition"
                          style={{
                            borderLeftWidth: "4px",
                            borderLeftColor: pile.status === "accepted" ? "#790f26" : "#c9aa35",
                          }}
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="kn-dot kn-dot-red" />
                                <h4 className="text-base font-extrabold text-[#1a1210]">
                                  {colourWords(pile.colourFamily, language)}
                                </h4>
                              </div>
                              <span className="font-mono text-sm font-black text-[#790f26]">
                                {pile.declaredQty.toLocaleString("en-IN")} pcs
                              </span>
                            </div>
                            <p className="text-xs text-[#785d4f] mt-1 pl-5">
                              {familyName(pile.householdId, language)} · {pile.locality}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Non-Matching Piles Section: RESPONSIVE 2-COLUMN GRID */}
                <div className="kn-card p-6 sm:p-8 border-[#e4d9c9] bg-[#fdf8f4]">
                  <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-4 mb-6">
                    <h3 className="text-lg font-bold text-[#1a1210]">{t("matching.nonMatchingPiles")}</h3>
                    <span className="kn-badge kn-badge-error text-xs font-mono px-3 py-1">{cannot.length}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cannot.map(({ pile, reason }, idx) => (
                      <motion.div
                        key={pile.batchId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(0.4, idx * 0.04) }}
                        className="p-4 rounded-xl border border-red-200 bg-[#fdf0f0]/60 flex items-center justify-between text-xs shadow-2xs"
                        style={{
                          borderLeftWidth: "4px",
                          borderLeftColor: "#b92b2b",
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-red-900 font-bold text-xs">{reason}</p>
                          <p className="text-xs text-[#785d4f] mt-0.5">
                            {familyName(pile.householdId, language)} · {pile.locality}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </PageContainer>
          )
        }
      </NeedLogin>
    </>
  );
}
