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
import { browserSpeechAvailable, listenOnce } from "@/lib/speech";
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
  const [craft, setCraft] = useState<Craft>("bangles");
  const [colourFamily, setColourFamily] = useState<"ruby_red" | "blue">("ruby_red");
  const [qty, setQty] = useState(200);
  const [grade, setGrade] = useState<"A" | "B">("B");
  const [hearing, setHearing] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [saved, setSaved] = useState<{ colour: "ruby_red" | "blue"; qty: number } | null>(
    null,
  );
  const [micOk, setMicOk] = useState(false);
  const [piles, setPiles] = useState<Pile[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    setMicOk(browserSpeechAvailable());
    function refresh() {
      setPiles(loadPiles());
      setDemands(loadDemands());
    }
    refresh();
    return onStoreChange(refresh);
  }, []);

  const mine = householdStockCards(piles, user.householdId || "");
  const chatPile = artisanChatPile(piles, user.householdId || "");
  const lockedCraft = craft !== "bangles";

  async function hear() {
    setVoiceNote("");
    if (!browserSpeechAvailable()) {
      setMicOk(false);
      setVoiceNote(t("artisan.micNeedChrome"));
      return;
    }
    setMicOk(true);
    setHearing(true);
    try {
      const hit = await listenOnce({
        speechLang: language,
        onPartial: (text) => setVoiceNote(`${language === "hi" ? "सुना:" : "Heard:"} ${text}`),
        onListening: () => setHearing(true),
      });
      if (hit.colourFamily === "blue") setColourFamily("blue");
      if (hit.colourFamily === "ruby_red") setColourFamily("ruby_red");
      if (hit.qty) setQty(hit.qty);
      if (hit.grade) setGrade(hit.grade);
      setVoiceNote(hit.raw ? `${language === "hi" ? "सुना:" : "Heard:"} ${hit.raw}` : "");
    } catch {
      setVoiceNote(language === "hi" ? "सुन नहीं सके। लिखें या बटन दबाएँ।" : "Could not hear. Type or tap.");
    } finally {
      setHearing(false);
    }
  }

  function postStock() {
    if (lockedCraft) return;
    if (qty < 1) return;
    const householdId = user.householdId || "HH-01";
    const locality = HOUSE_PLACE[householdId] || "Ramnagar";
    const next = loadPiles();
    const pile: Pile = {
      batchId: nextBatchId(next),
      householdId,
      locality,
      productFamily: "glass_bangle",
      size: "2-6",
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
      spokenTerm: colourFamily === "blue" ? "neeli chudi" : "lal chudi",
    };
    saveExtraPile(pile);
    setPiles(loadPiles());
    setSaved({ colour: colourFamily, qty });
  }

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
              onChange={(e) => setCraft(e.target.value as Craft)}
              className="kn-field text-sm font-bold"
            >
              <option value="bangles">{t("artisan.bangles")}</option>
              <option value="pottery">{t("artisan.pottery")}</option>
              <option value="textile">{t("artisan.textile")}</option>
            </select>
          </div>

          {lockedCraft ? (
            <div className="kn-card p-6 text-center text-[#785d4f] font-semibold text-sm">
              {t("artisan.locked")}
            </div>
          ) : (
            <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4] shadow-md">
              <h2 className="text-lg font-extrabold text-[#1a1210]">{t("artisan.addStock")}</h2>
              <p className="text-xs text-[#785d4f] mt-0.5">{t("artisan.addHint")}</p>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => void hear()}
                  disabled={hearing}
                  aria-pressed={hearing}
                  className={`kn-mic w-full ${hearing ? "is-listening" : ""}`}
                >
                  🎤 {hearing ? t("artisan.listening") : t("artisan.speak")}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-[#785d4f]">
                {micOk ? t("artisan.micHint") : "Use Chrome for voice recognition"}
              </p>

              <div className="mt-5">
                <p className="text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-2">{t("artisan.colour")}</p>
                <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                  <button
                    type="button"
                    onClick={() => setColourFamily("ruby_red")}
                    className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      colourFamily === "ruby_red" ? "bg-[#790f26] text-white" : "text-[#523a2f]"
                    }`}
                  >
                    <span className="kn-dot kn-dot-red" />
                    {t("artisan.red")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setColourFamily("blue")}
                    className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      colourFamily === "blue" ? "bg-[#1c466e] text-white" : "text-[#523a2f]"
                    }`}
                  >
                    <span className="kn-dot kn-dot-blue" />
                    {t("artisan.blue")}
                  </button>
                </div>
              </div>

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

              <div className="mt-4">
                <p className="text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1.5">{t("artisan.quality")}</p>
                <div className="grid grid-cols-2 gap-2 bg-[#faf0e4] p-1 rounded-xl border border-[#e4d9c9]">
                  <button
                    type="button"
                    onClick={() => setGrade("A")}
                    className={`py-2 rounded-lg text-xs font-bold transition ${grade === "A" ? "bg-[#790f26] text-white" : "text-[#523a2f]"}`}
                  >
                    {t("artisan.gradeA")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGrade("B")}
                    className={`py-2 rounded-lg text-xs font-bold transition ${grade === "B" ? "bg-[#790f26] text-white" : "text-[#523a2f]"}`}
                  >
                    {t("artisan.gradeB")}
                  </button>
                </div>
              </div>

              {saved ? (
                <p className="mt-4 text-xs font-bold text-[#790f26] bg-[#fdf0f0] p-3 rounded-xl border border-[#790f26]/20">
                  Saved: {pileTitle(saved.colour, saved.qty, language)}. Buyer can see it.
                </p>
              ) : null}

              <button
                type="button"
                onClick={postStock}
                className="kn-btn-primary w-full text-base font-bold py-3.5 mt-5"
              >
                {t("artisan.postStock")}
              </button>
            </section>
          )}
        </div>

        {/* Right Column: Demands & Stock */}
        <div className="lg:col-span-7 space-y-8">
          {/* Buyer Demands List */}
          <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4]">
            <h2 className="text-lg font-bold text-[#1a1210] border-b border-[#e4d9c9] pb-3 mb-4">{t("artisan.buyerWants")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demands.map((d) => (
                <div key={d.demandId} className="p-3.5 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`kn-dot ${d.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                    <div>
                      <p className="text-xs font-bold text-[#1a1210]">
                        {colourWords(d.colourFamily, language)} · {d.quantityNeeded.toLocaleString("en-IN")}{" "}
                        {language === "hi" ? "टुकड़े" : "pieces"}
                      </p>
                      <p className="text-[11px] text-[#785d4f]">
                        Size {d.size} · {gradeWords(d.grade, language)}
                      </p>
                    </div>
                  </div>

                  {chatPile ? (
                    <Link
                      href={`/chat?demandId=${encodeURIComponent(d.demandId)}&batchId=${encodeURIComponent(chatPile.batchId)}`}
                      className="kn-btn-primary text-xs py-1.5 px-3 shrink-0"
                    >
                      💬 Chat
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Your Declared Stock */}
          <section className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4]">
            <h2 className="text-lg font-bold text-[#1a1210] border-b border-[#e4d9c9] pb-3 mb-4">{t("artisan.yourStock")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mine.length === 0 ? (
                <div className="col-span-full p-6 text-center text-[#785d4f] text-xs font-bold">{t("artisan.noneYet")}</div>
              ) : (
                mine.map((pile) => (
                  <div key={pile.batchId} className="p-3.5 rounded-xl border border-[#e4d9c9] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`kn-dot ${pile.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                      <div>
                        <span className="font-mono text-xs font-bold text-[#790f26]">{pile.batchId}</span>
                        <p className="text-xs font-bold text-[#1a1210]">
                          {pileTitle(pile.colourFamily, pile.declaredQty, language)}
                        </p>
                      </div>
                    </div>
                    <span className="kn-badge kn-badge-warning text-[11px] font-bold uppercase">{pile.status}</span>
                  </div>
                ))
              )}
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
