"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import PoolCard from "@/components/PoolCard";
import ScoreBadge from "@/components/ScoreBadge";
import { colourWords, familyName, gradeWords, pileTitle } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import { matchPileToOrder } from "@/lib/match";
import { kmFromHub, distanceLabel } from "@/lib/places";
import { computePoolView } from "@/lib/pool";
import {
  cancelDemand,
  confirmToPool,
  demandHasAcceptedDemo,
  isSeedDemand,
  loadDemands,
  loadPiles,
  nextDemandId,
  onStoreChange,
  payBooking,
  saveDemand,
  type Demand,
} from "@/lib/store";
import type { Pile, SessionUser } from "@/lib/types";

type Ranked = { pile: Pile; km: number; reason: string | null };

function BuyerHome({ user }: { user: SessionUser }) {
  const { language, t } = useLanguage();
  const hi = language === "hi";

  const [colourFamily, setColourFamily] = useState<"ruby_red" | "blue">("ruby_red");
  const [qty, setQty] = useState<number | "">(10000);
  const [grade, setGrade] = useState<"A" | "B">("B");
  const [size, setSize] = useState("2-6");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [tick, setTick] = useState(0);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [piles, setPiles] = useState<Pile[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    function refresh() {
      const list = loadDemands();
      setDemands(list);
      setPiles(loadPiles());
      setActiveId((id) =>
        list.some((d) => d.demandId === id) ? id : list[0]?.demandId ?? "",
      );
    }
    refresh();
    return onStoreChange(refresh);
  }, [tick]);

  const active = demands.find((d) => d.demandId === activeId) ?? demands[0];

  const ranked = useMemo(() => {
    if (!active) {
      return { inn: [] as Ranked[], out: [] as Ranked[] };
    }
    const fields = {
      productFamily: active.productFamily,
      size: active.size,
      colourFamily: active.colourFamily,
      colourName: active.colourFamily,
      finish: "plain_glossy",
      finishName: "plain shiny",
      minGrade: active.grade,
    };
    const inn: Ranked[] = [];
    const out: Ranked[] = [];
    for (const pile of piles) {
      const result = matchPileToOrder(pile, fields);
      const row = { pile, km: kmFromHub(pile.locality), reason: result.reason };
      if (result.ok) inn.push(row);
      else out.push(row);
    }
    inn.sort((a, b) => a.km - b.km);
    out.sort((a, b) => a.km - b.km);
    return { inn, out };
  }, [piles, active]);

  const poolView = active ? computePoolView(active.demandId) : null;

  function postDemand() {
    if (!qty || Number(qty) < 1) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const list = loadDemands();
      const demand: Demand = {
        demandId: nextDemandId(list),
        buyerName: user.name,
        productFamily: "glass_bangle",
        size,
        colourFamily,
        grade,
        quantityNeeded: Number(qty),
        locality: "Firozabad mandi",
      };
      saveDemand(demand);
      setActiveId(demand.demandId);
      setTick((n) => n + 1);
      setIsSubmitting(false);
      setPosted(true);
      setTimeout(() => setPosted(false), 4000);
    }, 400);
  }

  function onCancel(demandId: string) {
    cancelDemand(demandId);
    setTick((n) => n + 1);
  }

  return (
    <PageContainer className="pb-24">
      {/* Page Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210]">
          {hi ? "खरीदार पोर्टल" : "Buyer Portal"}
        </h1>
        <p className="text-sm text-[#785d4f] mt-1">
          {hi
            ? "काँच नेटवर्क से अपनी ज़रूरत का नया ऑर्डर (मांग) दर्ज करें।"
            : "Tell us what you need from the craft network."}
        </p>
      </div>

      {/* Main Grid: Left = Create Demand Form, Right = Active Demands & Money Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Column: Create Demand Form */}
        <div className="lg:col-span-5 kn-card p-6 sm:p-7 border-[#e4d9c9] bg-[#fdf8f4]">
          <h2 className="text-lg font-bold text-[#1a1210] mb-5 border-b border-[#e4d9c9] pb-3">
            {hi ? "नई मांग दर्ज करें" : "Create Demand"}
          </h2>

          <div className="space-y-5">
            {/* Colour Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#523a2f] mb-2">
                {hi ? "रंग" : "Colour"}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setColourFamily("ruby_red")}
                  className={`relative py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    colourFamily === "ruby_red"
                      ? "bg-[#790f26] text-white shadow-xs"
                      : "text-[#523a2f]"
                  }`}
                >
                  <span className="kn-dot kn-dot-red" />
                  {hi ? "लाल (Ruby Red)" : "Ruby Red"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setColourFamily("blue")}
                  className={`relative py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    colourFamily === "blue"
                      ? "bg-[#1c466e] text-white shadow-xs"
                      : "text-[#523a2f]"
                  }`}
                >
                  <span className="kn-dot kn-dot-blue" />
                  {hi ? "नीला (Blue)" : "Blue"}
                </motion.button>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-xs font-semibold text-[#523a2f] mb-2">
                {hi ? "मात्रा (टुकड़े)" : "Quantity"}
              </label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="10,000"
                className="kn-field text-base font-mono font-medium"
              />
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#523a2f] mb-2">
                {hi ? "साइज़" : "Size"}
              </label>
              <div className="relative">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="kn-field text-sm font-semibold appearance-none pr-8 cursor-pointer"
                >
                  <option value="2-6">2-6</option>
                  <option value="2-4">2-4</option>
                  <option value="2-2">2-2</option>
                  <option value="2-8">2-8</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#785d4f]">
                  ▼
                </div>
              </div>
            </div>

            {/* Quality Grade Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#523a2f] mb-2">
                {hi ? "गुणवत्ता ग्रेड" : "Quality Grade"}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setGrade("A")}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    grade === "A"
                      ? "bg-[#790f26] text-white shadow-xs"
                      : "text-[#523a2f]"
                  }`}
                >
                  {hi ? "ग्रेड A (बढ़िया)" : "Grade A"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setGrade("B")}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    grade === "B"
                      ? "bg-[#790f26] text-white shadow-xs"
                      : "text-[#523a2f]"
                  }`}
                >
                  {hi ? "ग्रेड B (सामान्य)" : "Grade B"}
                </motion.button>
              </div>
            </div>

            {posted ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900"
              >
                ✅ {hi ? "मांग दर्ज हो गई है। मिलता स्टॉक नीचे देखें।" : "Demand created. Matched stock listed below."}
              </motion.div>
            ) : null}

            {/* Primary Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={postDemand}
              disabled={isSubmitting}
              className="kn-btn-primary w-full mt-2 font-bold"
            >
              {isSubmitting ? (
                <span className="animate-pulse">{hi ? "दर्ज हो रहा है..." : "Creating..."}</span>
              ) : (
                <span>{hi ? "मांग दर्ज करें" : "Create Demand"}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Column: Active Demands List & Escrow Stepper */}
        <div className="lg:col-span-7 space-y-8">
          {/* Your Active Demands List */}
          <div className="kn-card p-6 sm:p-7 border-[#e4d9c9] bg-[#fdf8f4]">
            <h2 className="text-lg font-bold text-[#1a1210] mb-4 border-b border-[#e4d9c9] pb-3">
              {hi ? "आपकी चालू मांगें (ऑर्डर)" : "Your Active Demands"}
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {demands.map((d) => {
                  const isActive = d.demandId === active?.demandId;
                  return (
                    <motion.div
                      key={d.demandId}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setActiveId(d.demandId)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        isActive
                          ? "border-2 border-[#790f26] bg-[#fdf0f0] shadow-md"
                          : "border-[#e4d9c9] bg-white hover:bg-[#faf0e4]"
                      }`}
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor: isActive ? "#790f26" : "#c9aa35",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`kn-dot ${d.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                        <div>
                          <p className="text-sm font-bold text-[#1a1210]">
                            {d.quantityNeeded.toLocaleString("en-IN")} {hi ? "नग" : "pcs"} · {colourWords(d.colourFamily, language)}
                          </p>
                          <p className="text-xs text-[#785d4f] mt-0.5">
                            Size {d.size} · Grade {d.grade} {isSeedDemand(d.demandId) ? "· Demo Order" : ""}
                          </p>
                        </div>
                      </div>

                      {!isSeedDemand(d.demandId) && !demandHasAcceptedDemo(d.demandId) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancel(d.demandId);
                          }}
                          className="text-xs text-[#8c1d1d] font-bold underline hover:no-underline ml-2"
                        >
                          {hi ? "रद्द करें" : "Cancel"}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Connected Money Pool Escrow Stepper */}
          {active && poolView ? (
            <PoolCard
              view={poolView}
              lang={language}
              onPayBooking={() => {
                payBooking(active.demandId);
                setTick((n) => n + 1);
              }}
              onConfirm={() => {
                confirmToPool(active.demandId);
                setTick((n) => n + 1);
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Matching Artisan Stock Section: RESPONSIVE 2-COLUMN GRID (grid-cols-1 md:grid-cols-2 gap-4) */}
      <div className="kn-card p-6 sm:p-8 border-[#e4d9c9] bg-[#fdf8f4] w-full">
        <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#1a1210]">
              {hi ? "मेल खाता कारीगर स्टॉक" : "Matching Artisan Stock"}
            </h2>
            <p className="text-xs text-[#785d4f] mt-0.5">
              {hi
                ? "मांग शर्तों के अनुसार पास के परिवारों का उपलब्ध स्टॉक"
                : "Artisan stock matching active order spec & location"}
            </p>
          </div>
          <span className="kn-badge kn-badge-success font-mono text-sm px-3 py-1">
            {ranked.inn.length} {hi ? "उपलब्ध" : "available"}
          </span>
        </div>

        {ranked.inn.length === 0 ? (
          <p className="text-xs text-[#785d4f] py-8 text-center font-medium">
            {hi ? "अभी कोई मिलता स्टॉक उपलब्ध नहीं है।" : "No matching stock available yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ranked.inn.map(({ pile }) => (
              <motion.div
                key={pile.batchId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between shadow-xs hover:border-[#790f26] transition"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: "#2e7d5b",
                }}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`kn-dot ${pile.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                  <div>
                    <span className="font-mono text-xs font-bold text-[#790f26]">{pile.batchId}</span>
                    <h4 className="text-sm font-bold text-[#1a1210]">
                      {pileTitle(pile.colourFamily, pile.declaredQty, language)}
                    </h4>
                    <p className="text-xs text-[#785d4f] mt-0.5">
                      {familyName(pile.householdId, language)} · {distanceLabel(pile.locality, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <ScoreBadge householdId={pile.householdId} lang={language} />
                  {active && (
                    <Link
                      href={`/chat?demandId=${encodeURIComponent(active.demandId)}&batchId=${encodeURIComponent(pile.batchId)}`}
                      className="kn-btn-primary text-xs py-1.5 px-3"
                    >
                      💬 Chat
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function BuyerPage() {
  return (
    <>
      <AppHeader />
      <NeedLogin>
        {(user) =>
          user.role === "buyer" ? (
            <BuyerHome user={user} />
          ) : (
            <p className="p-6 text-[#523a2f] text-center font-bold text-sm">Log in as the buyer to view this page.</p>
          )
        }
      </NeedLogin>
    </>
  );
}
