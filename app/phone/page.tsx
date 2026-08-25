"use client";

import { useEffect, useState } from "react";
import starter from "@/data/starter-list.json";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import { useLanguage } from "@/lib/LanguageContext";
import type { Pile, SessionUser } from "@/lib/types";

const LOCAL_STORAGE_PILES_KEY = "kanch-artisan-piles";

const PRODUCT_OPTIONS = [
  {
    id: "lal_chudi",
    hindiName: "लाल चूड़ी",
    englishName: "Red glass bangle",
    spokenTerm: "lal chudi",
    productFamily: "glass_bangle",
    colourFamily: "ruby_red",
    colourLabel: "लाल (Ruby Red)",
    finish: "plain_glossy",
    finishName: "plain shiny",
    grade: "B",
    icon: "🔴",
  },
  {
    id: "neeli_chudi",
    hindiName: "नीली चूड़ी",
    englishName: "Blue glass bangle",
    spokenTerm: "neeli chudi",
    productFamily: "glass_bangle",
    colourFamily: "blue",
    colourLabel: "नीला (Blue)",
    finish: "plain_glossy",
    finishName: "plain shiny",
    grade: "B",
    icon: "🔵",
  },
];

const SIZE_OPTIONS = ["2-6", "2-4", "2-2", "2-8"];

const DEFAULT_LOCALITY_MAP: Record<string, string> = {
  "HH-01": "Ramnagar",
  "HH-02": "Suhag Nagar",
  "HH-03": "Ramnagar",
};

export default function PhonePage() {
  return (
    <>
      <AppHeader />
      <NeedLogin>
        {(user) => <ArtisanPhoneHome user={user} />}
      </NeedLogin>
    </>
  );
}

function ArtisanPhoneHome({ user }: { user: SessionUser }) {
  const { language, t } = useLanguage();
  const hi = language === "hi";

  const [allPiles, setAllPiles] = useState<Pile[]>(starter.piles);
  const [activeTab, setActiveTab] = useState<"my_piles" | "add_pile" | "orders">("my_piles");
  const [currentStep, setCurrentStep] = useState<"form" | "confirm">("form");

  // Form inputs
  const [selectedProductId, setSelectedProductId] = useState<string>("lal_chudi");
  const [size, setSize] = useState<string>("2-6");
  const [declaredQty, setDeclaredQty] = useState<number | "">(450);
  const [readyDate, setReadyDate] = useState<string>("2026-09-08");

  // Speech & notification state
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [voiceNotification, setVoiceNotification] = useState<string | null>(null);
  const [recentSavedBatchId, setRecentSavedBatchId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PILES_KEY);
      if (stored) {
        const parsed: Pile[] = JSON.parse(stored);
        const existingIds = new Set(starter.piles.map((p) => p.batchId));
        const customOnly = parsed.filter((p) => !existingIds.has(p.batchId));
        setAllPiles([...starter.piles, ...customOnly]);
      }
    } catch {
      // fallback
    }
  }, []);

  const selectedProduct =
    PRODUCT_OPTIONS.find((p) => p.id === selectedProductId) || PRODUCT_OPTIONS[0];

  const myPiles = allPiles.filter((p) => p.householdId === user.householdId);

  function getNextBatchId(): string {
    let maxNum = 20;
    allPiles.forEach((p) => {
      const match = p.batchId.match(/^B-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `B-${String(maxNum + 1).padStart(3, "0")}`;
  }

  function handleSelectVoicePhrase(phrase: {
    productId: string;
    size: string;
    qty: number;
    date: string;
    text: string;
  }) {
    setSelectedProductId(phrase.productId);
    setSize(phrase.size);
    setDeclaredQty(phrase.qty);
    setReadyDate(phrase.date);
    setShowVoiceModal(false);
    setVoiceNotification(hi ? `आवाज़ पहचानी: "${phrase.text}"` : `Voice recognized: "${phrase.text}"`);
    setTimeout(() => setVoiceNotification(null), 5000);
  }

  function handleGoToConfirm() {
    setFormError(null);
    if (!declaredQty || Number(declaredQty) <= 0) {
      setFormError(hi ? "कृपया सही संख्या दर्ज करें (कम से कम 1 पीस)।" : "Please enter a valid quantity (min 1).");
      return;
    }
    if (!readyDate) {
      setFormError(hi ? "कृपया तैयार होने की तारीख चुनें।" : "Please select a ready date.");
      return;
    }
    setCurrentStep("confirm");
  }

  function handleSaveConfirmedPile() {
    const newBatchId = getNextBatchId();
    const householdId = user.householdId || "HH-01";
    const locality = DEFAULT_LOCALITY_MAP[householdId] || "Ramnagar";

    const newPile: Pile = {
      batchId: newBatchId,
      householdId: householdId,
      locality: locality,
      productFamily: selectedProduct.productFamily,
      size: size,
      colourFamily: selectedProduct.colourFamily,
      finish: selectedProduct.finish,
      grade: selectedProduct.grade,
      declaredQty: Number(declaredQty),
      collectedQty: null,
      acceptedQty: null,
      rejectedQty: null,
      damagedQty: null,
      status: "declared",
      rejectionReason: null,
      readyDate: readyDate,
      spokenTerm: selectedProduct.spokenTerm,
    };

    const updated = [...allPiles, newPile];
    setAllPiles(updated);

    try {
      const existingIds = new Set(starter.piles.map((p) => p.batchId));
      const customPiles = updated.filter((p) => !existingIds.has(p.batchId));
      localStorage.setItem(LOCAL_STORAGE_PILES_KEY, JSON.stringify(customPiles));
    } catch {
      // localstorage error
    }

    setRecentSavedBatchId(newBatchId);
    setCurrentStep("form");
    setDeclaredQty(450);
    setActiveTab("my_piles");
  }

  return (
    <main className="kn-shell mx-auto max-w-md px-4 py-6 pb-24 font-sans">
      {/* Header Info */}
      <div className="mb-4">
        <span className="kn-badge kn-badge-warning text-xs mb-1">
          {user.householdId ? `${user.householdId} · ${user.name}` : user.name}
        </span>
        <h1 className="text-xl font-bold text-[#2a1810]">
          {hi ? "घरेलू कारीगर पोर्टल" : "Worker Mobile Portal"}
        </h1>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex bg-[#f3ebdE] p-1 rounded-lg mb-5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("my_piles")}
          className={`flex-1 py-2 rounded-md transition ${
            activeTab === "my_piles"
              ? "bg-[#8b1e14] text-white"
              : "text-[#523a2f]"
          }`}
        >
          {t("phone.tabMyPiles")} ({myPiles.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("add_pile");
            setCurrentStep("form");
          }}
          className={`flex-1 py-2 rounded-md transition ${
            activeTab === "add_pile"
              ? "bg-[#8b1e14] text-white"
              : "text-[#523a2f]"
          }`}
        >
          {t("phone.tabAddPile")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 rounded-md transition ${
            activeTab === "orders"
              ? "bg-[#8b1e14] text-white"
              : "text-[#523a2f]"
          }`}
        >
          {t("phone.tabOrders")}
        </button>
      </div>

      {/* Success Notification */}
      {recentSavedBatchId && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-300 flex items-start gap-2.5 text-xs">
          <span>🎉</span>
          <div className="flex-1">
            <p className="font-bold text-emerald-950">
              {hi ? `बंडल ${recentSavedBatchId} दर्ज हो गया!` : `Batch ${recentSavedBatchId} saved!`}
            </p>
            <button
              type="button"
              onClick={() => setRecentSavedBatchId(null)}
              className="mt-1 font-bold text-emerald-800 underline"
            >
              {hi ? "बंद करें" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* Voice Notification */}
      {voiceNotification && (
        <div className="mb-4 p-3 rounded-lg bg-[#fdf3e5] border border-[#c86800]/20 text-xs font-semibold text-[#874400]">
          🗣️ {voiceNotification}
        </div>
      )}

      {/* TAB 1: MY PILES */}
      {activeTab === "my_piles" && (
        <section className="space-y-3">
          {myPiles.length === 0 ? (
            <div className="kn-card p-6 text-center text-[#785d4f] text-xs">
              <p className="font-bold text-sm text-[#2a1810]">{t("phone.noPilesYet")}</p>
              <p className="mt-1">{t("phone.noPilesSub")}</p>
            </div>
          ) : (
            myPiles.map((pile) => {
              const isRed = pile.colourFamily === "ruby_red" || pile.spokenTerm === "lal chudi";
              return (
                <div key={pile.batchId} className="kn-card p-3.5 border-[#e4d9c9] bg-[#fffdf9]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`kn-dot ${isRed ? "kn-dot-red" : "kn-dot-blue"}`} />
                      <div>
                        <span className="font-mono text-xs font-bold text-[#8b1e14]">
                          {pile.batchId}
                        </span>
                        <p className="text-sm font-bold text-[#2a1810]">
                          {isRed ? "लाल चूड़ी (Ruby Red)" : "नीली चूड़ी (Blue)"}
                        </p>
                      </div>
                    </div>
                    <span className={`kn-badge text-xs ${
                      pile.status === "declared" ? "kn-badge-warning" :
                      pile.status === "accepted" ? "kn-badge-success" : "kn-badge-neutral"
                    }`}>
                      {pile.status === "declared" ? (hi ? "दर्ज" : "Declared") :
                       pile.status === "accepted" ? (hi ? "स्वीकृत" : "Accepted") : pile.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 bg-[#fbf7f0] p-2 rounded-md text-xs text-[#523a2f]">
                    <div>
                      <span>{hi ? "संख्या:" : "Qty:"}</span> <strong className="text-[#2a1810] font-mono">{pile.declaredQty}</strong> pcs
                    </div>
                    <div>
                      <span>{hi ? "साइज़:" : "Size:"}</span> <strong className="text-[#2a1810]">{pile.size}</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* TAB 2: ADD PILE FORM */}
      {activeTab === "add_pile" && currentStep === "form" && (
        <section className="kn-card p-4 border-[#e4d9c9] bg-[#fffdf9] space-y-4">
          <button
            type="button"
            onClick={() => setShowVoiceModal(true)}
            className="kn-mic w-full"
          >
            🎤 {t("phone.speakBtn")}
          </button>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
              ⚠️ {formError}
            </div>
          )}

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#523a2f] mb-1.5">
              {t("phone.productLabel")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT_OPTIONS.map((prod) => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`kn-chip flex-col h-auto py-2.5 ${isSelected ? "is-on" : ""}`}
                  >
                    <span className="text-base">{prod.icon}</span>
                    <span className="text-xs font-bold mt-0.5">{prod.hindiName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#523a2f] mb-1.5">
              {t("phone.sizeLabel")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`kn-chip text-xs ${size === s ? "is-on" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-semibold text-[#523a2f] mb-1.5">
              {t("phone.qtyLabel")}
            </label>
            <input
              type="number"
              min="1"
              value={declaredQty}
              onChange={(e) => setDeclaredQty(e.target.value === "" ? "" : Number(e.target.value))}
              className="kn-field text-base font-mono font-medium"
            />
            <div className="mt-2 flex gap-1.5">
              {[200, 300, 450, 500].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDeclaredQty(q)}
                  className="px-2.5 py-1 rounded bg-[#f3ebdE] text-xs font-semibold text-[#523a2f]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Ready Date */}
          <div>
            <label className="block text-xs font-semibold text-[#523a2f] mb-1.5">
              {t("phone.readyDateLabel")}
            </label>
            <input
              type="date"
              value={readyDate}
              onChange={(e) => setReadyDate(e.target.value)}
              className="kn-field text-sm font-medium"
            />
          </div>

          <button
            type="button"
            onClick={handleGoToConfirm}
            className="kn-btn-primary w-full mt-2 font-bold"
          >
            {t("phone.submitNext")}
          </button>
        </section>
      )}

      {/* CONFIRMATION STEP */}
      {activeTab === "add_pile" && currentStep === "confirm" && (
        <section className="kn-card p-4 border-[#8b1e14] bg-[#fffdf9] space-y-4">
          <div className="text-center">
            <h3 className="text-base font-bold text-[#8b1e14]">{t("phone.confirmTitle")}</h3>
            <p className="text-xs text-[#785d4f] mt-0.5">{t("phone.confirmSub")}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-[#fbf7f0] border border-[#e4d9c9] text-xs">
            <div className="flex justify-between border-b border-[#e4d9c9] pb-1.5">
              <span className="text-[#785d4f]">{hi ? "उत्पाद:" : "Product:"}</span>
              <span className="font-bold text-[#2a1810]">{selectedProduct.hindiName}</span>
            </div>
            <div className="flex justify-between border-b border-[#e4d9c9] pb-1.5">
              <span className="text-[#785d4f]">{hi ? "साइज़:" : "Size:"}</span>
              <span className="font-bold text-[#2a1810]">{size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#785d4f]">{hi ? "संख्या:" : "Quantity:"}</span>
              <span className="font-mono font-bold text-[#8b1e14]">{declaredQty} pcs</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSaveConfirmedPile}
              className="kn-btn-primary kn-btn-success w-full font-bold"
            >
              ✅ {t("phone.confirmYes")}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep("form")}
              className="kn-btn-secondary w-full text-xs font-semibold"
            >
              ✏️ {t("phone.confirmEdit")}
            </button>
          </div>
        </section>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === "orders" && (
        <section className="kn-card p-4 border-[#e4d9c9] bg-[#fffdf9]">
          <h2 className="text-sm font-bold text-[#2a1810] mb-2">{t("phone.openDemandsTitle")}</h2>
          <div className="p-3 rounded-lg border border-[#e4d9c9] bg-white flex items-center justify-between text-xs">
            <div>
              <span className="font-mono font-bold text-[#8b1e14]">ORD-001</span>
              <p className="font-semibold text-[#2a1810] mt-0.5">Ruby Red Bangles · Size 2-6</p>
            </div>
            <span className="font-mono font-bold text-[#785d4f]">10,000 pcs</span>
          </div>
        </section>
      )}

      {/* Voice Assistant Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#fffdf9] border border-[#e4d9c9] p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#e4d9c9] pb-2.5">
              <h3 className="text-sm font-bold text-[#2a1810]">🎙️ बोलकर दर्ज करें</h3>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-xs font-bold text-[#785d4f]"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {[
                {
                  productId: "lal_chudi",
                  size: "2-6",
                  qty: 450,
                  date: "2026-09-08",
                  text: "लाल चूड़ी 450 पीस 2-6 साइज़",
                  icon: "🔴",
                },
                {
                  productId: "neeli_chudi",
                  size: "2-6",
                  qty: 300,
                  date: "2026-09-09",
                  text: "नीली चूड़ी 300 पीस 2-6 साइज़",
                  icon: "🔵",
                },
              ].map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectVoicePhrase(phrase)}
                  className="w-full text-left p-2.5 rounded-lg border border-[#e4d9c9] bg-[#fbf7f0] flex items-center gap-2 text-xs font-medium text-[#2a1810]"
                >
                  <span>{phrase.icon}</span>
                  <span>&ldquo;{phrase.text}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
