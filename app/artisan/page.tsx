"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import ScoreBadge from "@/components/ScoreBadge";
import { colourWords, gradeWords, pileTitle } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import { HOUSE_PLACE, distanceLabel } from "@/lib/places";
import {
  artisanChatPile,
  householdStockCards,
  loadDemands,
  loadPiles,
  nextBatchId,
  onStoreChange,
  saveExtraPile,
  type Demand,
} from "@/lib/store";
import type { Pile, SessionUser } from "@/lib/types";

type Craft = "bangles" | "pottery" | "textile";

export default function ArtisanPage() {
  return (
    <>
      <AppHeader />
      <NeedLogin>
        {(user) =>
          user.role === "artisan" ? <ArtisanHome user={user} /> : <ArtisanWrongRole />
        }
      </NeedLogin>
    </>
  );
}

function ArtisanHome({ user }: { user: SessionUser }) {
  const { language, t } = useLanguage();
  const hi = language === "hi";
  const [craft, setCraft] = useState<Craft>("bangles");
  const [colourFamily, setColourFamily] = useState<"ruby_red" | "blue">("ruby_red");
  const [bangleSize, setBangleSize] = useState("2-6");
  const [qty, setQty] = useState(200);
  const [grade, setGrade] = useState<"A" | "B">("B");
  const [saved, setSaved] = useState<{ colour: "ruby_red" | "blue"; qty: number; size: string } | null>(
    null,
  );
  const [piles, setPiles] = useState<Pile[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    function refresh() {
      setPiles(loadPiles());
      setDemands(loadDemands());
    }
    refresh();
    return onStoreChange(refresh);
  }, []);

  const mine = householdStockCards(piles, user.householdId || "");
  const chatPile = artisanChatPile(piles, user.householdId || "");

  function postStock() {
    if (qty < 1) return;
    const householdId = user.householdId || "HH-01";
    const locality = HOUSE_PLACE[householdId] || "Ramnagar";
    const next = loadPiles();
    const pile: Pile = {
      batchId: nextBatchId(next),
      householdId,
      locality,
      productFamily: craft === "pottery" ? "pottery_diyas" : craft === "textile" ? "textile_scarves" : "glass_bangle",
      size: bangleSize,
      colourFamily,
      finish: "plain_glossy",
      grade,
      declaredQty: qty,
      collectedQty: null,
      acceptedQty: null,
      rejectedQty: null,
      damagedQty: null,
      status: "declared",
      rejectionReason: null,
      readyDate: "2026-09-08",
      spokenTerm: colourFamily === "blue" ? "blue stock" : "red stock",
    };
    saveExtraPile(pile);
    setPiles(loadPiles());
    setSaved({ colour: colourFamily, qty, size: bangleSize });
  }

  // Category-reactive Demands list
  const filteredDemands = demands.filter((d) => {
    if (craft === "pottery") return d.productFamily === "pottery" || d.productFamily === "pottery_diyas";
    if (craft === "textile") return d.productFamily === "textile" || d.productFamily === "textile_scarves";
    return d.productFamily === "glass_bangle" || !d.productFamily;
  });

  const displayDemands = filteredDemands.length > 0 ? filteredDemands : [
    {
      demandId: craft === "pottery" ? "DEM-POT-01" : "DEM-TEX-01",
      buyerName: "Wholesale Buyer",
      productFamily: craft === "pottery" ? "pottery" : "textile",
      size: "2-6",
      colourFamily,
      grade: "A",
      quantityNeeded: craft === "pottery" ? 2500 : 1200,
      locality: "Firozabad Mandi",
    },
  ];

  // Category-reactive "My Piles" stock list
  const filteredMine = mine.filter((pile) => {
    if (craft === "pottery") return pile.productFamily === "pottery" || pile.productFamily === "pottery_diyas";
    if (craft === "textile") return pile.productFamily === "textile" || pile.productFamily === "textile_scarves";
    return pile.productFamily === "glass_bangle" || !pile.productFamily;
  });

  const displayMine: Pile[] = filteredMine.length > 0 ? filteredMine : [
    {
      batchId: craft === "pottery" ? "POT-001" : craft === "textile" ? "TEX-001" : "B-001",
      householdId: user.householdId || "HH-01",
      locality: "Ramnagar",
      productFamily: craft === "pottery" ? "pottery_diyas" : craft === "textile" ? "textile_scarves" : "glass_bangle",
      size: "2-6",
      colourFamily,
      finish: "plain_glossy",
      grade: "A",
      declaredQty: craft === "pottery" ? 600 : 350,
      collectedQty: null,
      acceptedQty: null,
      rejectedQty: null,
      damagedQty: null,
      status: "declared",
      rejectionReason: null,
      readyDate: "2026-09-08",
      spokenTerm: "stock",
    },
  ];

  return (
    <PageContainer className="pb-28">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210]">{t("artisan.title")}</h1>
          <p className="text-xs font-bold text-[#785d4f] mt-0.5">{user.name}</p>
        </div>
        <div>
          {user.householdId ? <ScoreBadge householdId={user.householdId} lang={language} /> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Craft Category Picker */}
          <div>
            <label className="block text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1.5">{t("artisan.craftLabel")}</label>
            <select
              value={craft}
              onChange={(e) => {
                setCraft(e.target.value as Craft);
                setSaved(null);
              }}
              className="kn-field text-sm font-bold cursor-pointer"
            >
              <option value="bangles">{t("artisan.bangles")} (Glass Bangles)</option>
              <option value="pottery">{t("artisan.pottery")} (Terracotta Pottery)</option>
              <option value="textile">{t("artisan.textile")} (Handloom Textiles)</option>
            </select>
          </div>

          <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4] shadow-md">
            <h2 className="text-lg font-extrabold text-[#1a1210]">
              {craft === "pottery"
                ? (hi ? "मिट्टी के बंडल दर्ज करें" : "Declare Pottery Stock")
                : craft === "textile"
                ? (hi ? "कपड़ा/टेक्सटाइल बंडल दर्ज करें" : "Declare Textile Stock")
                : t("artisan.addStock")}
            </h2>
            <p className="text-xs text-[#785d4f] mt-0.5">{t("artisan.addHint")}</p>

            {/* Colour Selector */}
            <div className="mt-5">
              <p className="text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-2">{t("artisan.colour")}</p>
              <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                <button
                  type="button"
                  onClick={() => setColourFamily("ruby_red")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                    colourFamily === "ruby_red" ? "bg-[#790f26] text-white" : "text-[#523a2f]"
                  }`}
                >
                  <span className="kn-dot kn-dot-red" />
                  {craft === "pottery"
                    ? (hi ? "टेराकोटा लाल" : "Terracotta Red")
                    : craft === "textile"
                    ? (hi ? "ज़री लाल" : "Zari Red")
                    : t("artisan.red")}
                </button>
                <button
                  type="button"
                  onClick={() => setColourFamily("blue")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                    colourFamily === "blue" ? "bg-[#1c466e] text-white" : "text-[#523a2f]"
                  }`}
                >
                  <span className="kn-dot kn-dot-blue" />
                  {craft === "pottery"
                    ? (hi ? "क्ले नीला" : "Glazed Blue")
                    : craft === "textile"
                    ? (hi ? "सिल्क नीला" : "Silk Blue")
                    : t("artisan.blue")}
                </button>
              </div>
            </div>

            {/* Size Selector (2-4, 2-6, 2-8, etc.) */}
            <div className="mt-4">
              <p className="text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1.5">
                {hi ? "साइज़ (Size)" : "Size"}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                {["2-4", "2-6", "2-8", "2-2"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setBangleSize(sz)}
                    className={`py-2.5 rounded-lg text-xs font-mono font-extrabold transition min-h-[44px] cursor-pointer ${
                      bangleSize === sz ? "bg-[#790f26] text-white shadow-xs" : "text-[#523a2f] hover:bg-white/50"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1.5">{t("artisan.howMany")}</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="kn-field text-xl font-mono font-bold"
              />
            </div>

            {/* Quality Grade Selector */}
            <div className="mt-4">
              <p className="text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1.5">{t("artisan.quality")}</p>
              <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                <button
                  type="button"
                  onClick={() => setGrade("A")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition min-h-[44px] ${grade === "A" ? "bg-[#790f26] text-white" : "text-[#523a2f]"}`}
                >
                  {t("artisan.gradeA")}
                </button>
                <button
                  type="button"
                  onClick={() => setGrade("B")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition min-h-[44px] ${grade === "B" ? "bg-[#790f26] text-white" : "text-[#523a2f]"}`}
                >
                  {t("artisan.gradeB")}
                </button>
              </div>
            </div>

            {saved ? (
              <p className="mt-4 text-xs font-bold text-[#790f26] bg-[#fdf0f0] p-3 rounded-xl border border-[#790f26]/20">
                ✅ Saved: {pileTitle(saved.colour, saved.qty, language)} · Size {saved.size}. Buyer can see it.
              </p>
            ) : null}

            {/* Prominent Primary Action Button */}
            <button
              type="button"
              onClick={postStock}
              className="kn-btn-primary w-full text-base sm:text-lg font-extrabold py-4 px-6 min-h-[50px] mt-6 shadow-md"
            >
              {t("artisan.postStock")}
            </button>
          </section>
        </div>

        {/* Right Column: Buyer Demands & Category-Reactive My Piles Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* Buyer Demands List */}
          <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4]">
            <h2 className="text-lg font-bold text-[#1a1210] border-b border-[#e4d9c9] pb-3 mb-4">
              {craft === "pottery"
                ? (hi ? "मिट्टी के बंडलों की थोक मांगें" : "Wholesale Buyer Demands (Pottery)")
                : craft === "textile"
                ? (hi ? "टेक्सटाइल बंडलों की थोक मांगें" : "Wholesale Buyer Demands (Textiles)")
                : t("artisan.buyerWants")}
            </h2>
            <div className="grid grid-cols-1 gap-3.5">
              {displayDemands.map((d) => (
                <div key={d.demandId} className="p-4 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className={`kn-dot ${d.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                    <div>
                      {/* De-emphasized Code */}
                      <span className="font-mono text-[10px] text-[#785d4f] font-normal block uppercase tracking-wider">
                        {d.demandId}
                      </span>
                      {/* Prominent Color / Quantity Headline */}
                      <p className="text-base sm:text-lg font-black text-[#1a1210] leading-tight">
                        {colourWords(d.colourFamily, language)} · {d.quantityNeeded.toLocaleString("en-IN")}{" "}
                        {hi ? "टुकड़े" : "pcs"}
                      </p>
                      <p className="text-xs text-[#785d4f] mt-0.5">
                        Size {d.size} · Grade {d.grade} · {d.locality}
                      </p>
                    </div>
                  </div>

                  {chatPile ? (
                    <Link
                      href={`/chat?demandId=${encodeURIComponent(d.demandId)}&batchId=${encodeURIComponent(chatPile.batchId)}`}
                      className="kn-btn-primary text-xs py-2 px-3.5 shrink-0 min-h-[40px] flex items-center"
                    >
                      💬 Chat
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Category-Reactive My Piles / Your Declared Stock Section */}
          <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4]">
            <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-3 mb-4">
              <h2 className="text-lg font-bold text-[#1a1210]">
                {t("artisan.yourStock")}
              </h2>
              <span className="kn-badge kn-badge-gold uppercase text-[10px] font-mono font-bold">
                {craft.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {displayMine.map((pile) => (
                <div key={pile.batchId} className="p-4 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className={`kn-dot ${pile.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                    <div>
                      {/* De-emphasized Bundle ID Code */}
                      <span className="font-mono text-[10px] text-[#785d4f] font-normal block uppercase">
                        {pile.batchId}
                      </span>
                      {/* Prominent Color & Quantity Headline */}
                      <p className="text-sm sm:text-base font-black text-[#1a1210] leading-tight">
                        {colourWords(pile.colourFamily, language)} · {pile.declaredQty.toLocaleString("en-IN")} pcs
                      </p>
                      <p className="text-[11px] text-[#785d4f] font-semibold mt-0.5">
                        Size {pile.size} · Grade {pile.grade}
                      </p>
                    </div>
                  </div>
                  <span className="kn-badge kn-badge-warning text-[10px] font-bold uppercase shrink-0">
                    {pile.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

function ArtisanWrongRole() {
  const { language } = useLanguage();
  return <p className="p-6 text-[#523a2f] text-center font-bold text-sm">{language === "hi" ? "इस पेज के लिए कारीगर के रूप में लॉगिन करें।" : "Log in as an artisan to use this page."}</p>;
}
