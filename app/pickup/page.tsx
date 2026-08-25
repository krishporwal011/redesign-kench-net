"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import { colourWords, familyName } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import {
  loadCollectorMap,
  loadPiles,
  saveCollectorMap,
  type CollectorOverride,
} from "@/lib/store";

type BatchRecord = {
  batchId: string;
  householdId: string;
  locality: string;
  colourFamily: string;
  declaredQty: number;
  collectedQty: number | null;
  condition: "OK" | "Damaged" | null;
  acceptedQty: number | null;
  rejectedQty: number | null;
  damagedQty: number | null;
  status: string;
  rejectionReason: string | null;
};

function toBatch(
  pile: {
    batchId: string;
    householdId: string;
    locality: string;
    colourFamily: string;
    declaredQty: number;
    collectedQty: number | null;
    acceptedQty: number | null;
    rejectedQty: number | null;
    damagedQty: number | null;
    status: string;
    rejectionReason: string | null;
  },
  override: CollectorOverride = {},
): BatchRecord {
  return {
    batchId: pile.batchId,
    householdId: override.householdId || pile.householdId,
    locality: override.locality || pile.locality,
    colourFamily: override.colourFamily || pile.colourFamily,
    declaredQty: override.declaredQty ?? pile.declaredQty,
    collectedQty:
      override.collectedQty !== undefined
        ? override.collectedQty
        : pile.collectedQty,
    condition:
      override.condition !== undefined
        ? override.condition
        : pile.collectedQty
          ? "OK"
          : null,
    acceptedQty:
      override.acceptedQty !== undefined
        ? override.acceptedQty
        : pile.acceptedQty,
    rejectedQty:
      override.rejectedQty !== undefined
        ? override.rejectedQty
        : pile.rejectedQty,
    damagedQty:
      override.damagedQty !== undefined
        ? override.damagedQty
        : pile.damagedQty,
    status: override.status !== undefined ? override.status : pile.status,
    rejectionReason:
      override.rejectionReason !== undefined
        ? override.rejectionReason
        : pile.rejectionReason,
  };
}

export default function PickupPage() {
  const { language, t } = useLanguage();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [collectedInput, setCollectedInput] = useState("");
  const [goodInput, setGoodInput] = useState("");
  const [brokenInput, setBrokenInput] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedMap = loadCollectorMap();
      const piles = loadPiles();
      const initialBatches: BatchRecord[] = piles.map((pile) =>
        toBatch(pile, savedMap[pile.batchId] || {}),
      );

      Object.keys(savedMap).forEach((id) => {
        if (!initialBatches.some((b) => b.batchId === id)) {
          const item = savedMap[id];
          initialBatches.unshift({
            batchId: id,
            householdId: item.householdId || "Custom",
            locality: item.locality || "Local",
            colourFamily: item.colourFamily || "ruby_red",
            declaredQty: item.declaredQty || (item.collectedQty ?? 0),
            collectedQty: item.collectedQty ?? null,
            condition: item.condition ?? null,
            acceptedQty: item.acceptedQty ?? null,
            rejectedQty: item.rejectedQty ?? null,
            damagedQty: item.damagedQty ?? null,
            status: item.status || "collected",
            rejectionReason: item.rejectionReason ?? null,
          });
        }
      });

      setBatches(initialBatches);
    } catch {
      setBatches(loadPiles().map((pile) => toBatch(pile)));
    }
    setIsLoaded(true);
  }, []);

  function persistBatches(updatedList: BatchRecord[]) {
    const map: Record<string, CollectorOverride> = {};
    updatedList.forEach((b) => {
      map[b.batchId] = b;
    });
    saveCollectorMap(map);
  }

  function pickPile(pile: BatchRecord) {
    setSelectedId(pile.batchId);
    const collected = pile.collectedQty ?? pile.declaredQty;
    setCollectedInput(String(collected));
    setGoodInput(String(pile.acceptedQty ?? collected));
    setBrokenInput(String(pile.damagedQty ?? 0));
    setError(null);
    setSavedNote(null);
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSavedNote(null);

    const active = batches.find((b) => b.batchId === selectedId);
    if (!active) {
      setError(language === "hi" ? "पहले ढेर चुनें।" : "Pick a pile first.");
      return;
    }

    if (
      collectedInput.trim() === "" ||
      goodInput.trim() === "" ||
      brokenInput.trim() === ""
    ) {
      setError(language === "hi" ? "तीनों संख्या लिखें।" : "Fill collected, good, and broken numbers.");
      return;
    }

    const collected = Number(collectedInput);
    const good = Number(goodInput);
    const broken = Number(brokenInput);

    if (
      !Number.isInteger(collected) ||
      !Number.isInteger(good) ||
      !Number.isInteger(broken) ||
      collected < 0 ||
      good < 0 ||
      broken < 0
    ) {
      setError(language === "hi" ? "पूरी संख्या लिखें।" : "Use valid positive whole numbers.");
      return;
    }

    if (good + broken > collected) {
      setError(
        language === "hi"
          ? "अच्छा + टूटा, कुल इकट्ठा से ज़्यादा नहीं हो सकता।"
          : "Good + broken cannot exceed total collected.",
      );
      return;
    }

    const leftover = collected - good - broken;
    const updated: BatchRecord = {
      ...active,
      collectedQty: collected,
      condition: broken > 0 ? "Damaged" : "OK",
      acceptedQty: good,
      rejectedQty: leftover,
      damagedQty: broken,
      status: "accepted",
      rejectionReason: broken > 0 || leftover > 0 ? "Broken/QC Defect" : null,
    };

    const updatedList = batches.map((b) =>
      b.batchId === selectedId ? updated : b,
    );
    setBatches(updatedList);
    persistBatches(updatedList);
    setSavedNote(t("pickup.savedMsg"));
  }

  const selected = batches.find((b) => b.batchId === selectedId);

  return (
    <>
      <AppHeader />
      <NeedLogin>
        {() =>
          !isLoaded ? (
            <div className="p-8 text-center text-[#785d4f]">Loading Pickup QC Portal...</div>
          ) : (
            <PageContainer className="pb-28">
              {/* Header */}
              <div className="mb-8 border-b border-[#e4d9c9] pb-4">
                <span className="kn-badge kn-badge-gold uppercase text-[11px]">{t("pickup.badge")}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210] mt-1">
                  {t("pickup.title")}
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Pile Selection Grid */}
                <div className="lg:col-span-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#1a1210] uppercase tracking-wider">
                      1. {t("pickup.selectBatch")}
                    </h2>
                    <span className="text-xs text-[#785d4f] font-mono">{batches.length} batches</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {batches.map((pile) => {
                      const on = pile.batchId === selectedId;
                      return (
                        <button
                          key={pile.batchId}
                          type="button"
                          onClick={() => pickPile(pile)}
                          className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                            on
                              ? "border-2 border-[#790f26] bg-[#fdf0f0] shadow-md"
                              : "border-[#e4d9c9] bg-[#fdf8f4] hover:bg-[#faf0e4]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`kn-dot ${pile.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                            <div>
                              <span className="font-mono text-xs font-bold text-[#790f26]">{pile.batchId}</span>
                              <h4 className="text-xs font-bold text-[#1a1210]">
                                {familyName(pile.householdId, language)} · {pile.locality}
                              </h4>
                              <p className="text-[11px] text-[#785d4f]">
                                {colourWords(pile.colourFamily, language)} · {pile.declaredQty} pcs
                              </p>
                            </div>
                          </div>
                          <span className={`kn-badge text-[10px] ${pile.status === "accepted" ? "kn-badge-success" : "kn-badge-warning"}`}>
                            {pile.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: QC Verification Form */}
                <div className="lg:col-span-6">
                  {selected ? (
                    <form onSubmit={handleSave} className="kn-card p-6 border-[#e4d9c9] bg-[#fdf8f4] shadow-md space-y-4">
                      <div className="border-b border-[#e4d9c9] pb-3">
                        <span className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">
                          2. {t("pickup.inspectTitle")}
                        </span>
                        <h3 className="text-lg font-extrabold text-[#790f26] font-mono mt-0.5">
                          Batch {selected.batchId} ({familyName(selected.householdId, language)})
                        </h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1a1210] uppercase tracking-wider mb-1">
                          {t("pickup.collected")}
                        </label>
                        <input
                          className="kn-field text-base font-mono font-bold"
                          inputMode="numeric"
                          value={collectedInput}
                          onChange={(e) => setCollectedInput(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
                            {t("pickup.good")}
                          </label>
                          <input
                            className="kn-field text-base font-mono font-bold border-emerald-300 bg-emerald-50/50"
                            inputMode="numeric"
                            value={goodInput}
                            onChange={(e) => setGoodInput(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                            {t("pickup.damaged")}
                          </label>
                          <input
                            className="kn-field text-base font-mono font-bold border-red-200 bg-red-50/50"
                            inputMode="numeric"
                            value={brokenInput}
                            onChange={(e) => setBrokenInput(e.target.value)}
                          />
                        </div>
                      </div>

                      {error ? (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800">
                          ⚠️ {error}
                        </div>
                      ) : null}

                      {savedNote ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
                          ✅ {savedNote}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        className="kn-btn-primary w-full text-base font-bold py-3 mt-2"
                      >
                        {t("pickup.saveBtn")}
                      </button>
                    </form>
                  ) : null}

                  <div className="mt-6 text-center">
                    <Link href="/money" className="kn-btn-secondary text-xs font-bold py-2.5 px-4 inline-flex items-center gap-1">
                      <span>{language === "hi" ? "भुगतान और एस्क्रो देखें" : "View Payouts & Escrow"}</span>
                      <span>➔</span>
                    </Link>
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
