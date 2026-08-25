"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatInr, type PoolView } from "@/lib/pool";
import type { UiLang } from "@/lib/lang";

export default function PoolCard({
  view,
  lang,
  onPayBooking,
  onConfirm,
  compact,
}: {
  view: PoolView;
  lang: UiLang;
  onPayBooking?: () => void;
  onConfirm?: () => void;
  compact?: boolean;
}) {
  const hi = lang === "hi";
  // Collapsed dropdown CLOSED by default on page load
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      id: 1,
      title: hi ? "1. एडवांस बुकिंग" : "1. Advance Booking Deposit",
      sub: view.bookingPaid
        ? hi ? "✅ भुगतान संपन्न (~25%)" : "✅ Payment Completed (~25%)"
        : hi ? "⏳ बकाया deposit" : "⏳ Pending (~25%)",
      amount: formatInr(view.bookingInr),
      status: view.bookingPaid ? "completed" : "active",
      accent: "#c9aa35",
    },
    {
      id: 2,
      title: hi ? "2. एस्क्रो पूल सुरक्षित" : "2. Locked in Escrow Pool",
      sub: view.confirmed
        ? hi ? "✅ एस्क्रो सुरक्षित" : "✅ Pool Locked"
        : hi ? "कन्फर्म के बाद" : "Awaiting buyer confirmation",
      amount: formatInr(view.inPoolInr),
      status: view.confirmed ? "completed" : view.bookingPaid ? "active" : "pending",
      accent: "#c9aa35",
    },
    {
      id: 3,
      title: hi ? "3. कारीगर परिवारों को रिहाई" : "3. Released to Artisan Families",
      sub: hi ? "कलेक्टर QC जाँच के बाद" : "Collector QC Verified",
      amount: formatInr(view.releasedInr),
      status: view.releasedInr > 0 ? "completed" : view.confirmed ? "active" : "pending",
      accent: "#2e7d5b",
    },
    {
      id: 4,
      title: hi ? "4. खरीदार वापसी (अस्वीकृत राशि)" : "4. Returned to Buyer",
      sub: hi ? "टूटा / खराब माल रिफंड" : "Rejected / QC Defect Refund",
      amount: formatInr(view.returnedInr),
      status: view.returnedInr > 0 ? "completed" : "pending",
      accent: "#b92b2b",
    },
  ];

  return (
    <section className={compact ? "" : "kn-card p-5 border-[#e4d9c9] bg-[#fdf8f4] shadow-md overflow-hidden"}>
      {!compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none group"
        >
          <div>
            <span className="kn-badge kn-badge-gold uppercase tracking-wider text-[11px]">Financial Escrow</span>
            <h2 className="text-xl font-extrabold text-[#1a1210] mt-0.5 group-hover:text-[#790f26] transition flex items-center gap-2">
              <span>{hi ? "पैसा पूल व एस्क्रो" : "Money Pool & Financial Escrow"}</span>
              <span className="text-xs text-[#785d4f] font-normal">{isOpen ? "▲ (Click to close)" : "▼ (Click to expand)"}</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {view.qtyLocked && (
              <span className="kn-badge kn-badge-success text-xs font-mono font-bold">
                {hi ? `लॉक: ${view.qty.toLocaleString("en-IN")}` : `Locked: ${view.qty.toLocaleString("en-IN")}`}
              </span>
            )}
            <span className="text-sm font-bold text-[#790f26] bg-[#faf0e4] px-2.5 py-1 rounded-lg border border-[#e4d9c9]">
              {isOpen ? "▲" : "▼"}
            </span>
          </div>
        </button>
      ) : null}

      {/* Collapsible Body Content */}
      <AnimatePresence initial={false}>
        {(isOpen || compact) && (
          <motion.div
            initial={compact ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={compact ? "" : "mt-4 pt-4 border-t border-[#e4d9c9] space-y-4"}
          >
            {/* Vertical Stepper Connected Tracker */}
            <div className="relative pl-6 space-y-4">
              {/* Vertical Connecting Line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#e4d9c9]" />

              {steps.map((step) => {
                const isDone = step.status === "completed";
                const isActive = step.status === "active";

                return (
                  <div key={step.id} className="relative flex items-start justify-between text-xs">
                    {/* Step Status Node Dot */}
                    <div
                      className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isDone
                          ? "bg-[#2e7d5b] border-[#2e7d5b] text-white shadow-xs"
                          : isActive
                          ? "bg-[#c9aa35] border-[#c9aa35] text-[#3d0a11] font-bold"
                          : "bg-white border-[#d0c2b0] text-[#785d4f]"
                      }`}
                    >
                      {isDone ? "✓" : step.id}
                    </div>

                    {/* Step Description */}
                    <div className="pr-2">
                      <p className={`font-bold text-xs ${isDone || isActive ? "text-[#1a1210]" : "text-[#785d4f]"}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-[#785d4f]">{step.sub}</p>
                    </div>

                    {/* Amount Badge */}
                    <span className={`font-mono text-xs font-extrabold shrink-0 ${isDone ? "text-[#2e7d5b]" : "text-[#790f26]"}`}>
                      {step.amount}
                    </span>
                  </div>
                );
              })}
            </div>

            {view.awaitingQc && (
              <div className="mt-4 text-xs text-[#705800] bg-[#fdf8e5] p-2.5 rounded-lg border border-[#c9aa35]/30 text-center font-medium">
                ⏳ {hi ? "कलेक्टर QC जाँच के बाद ही भुगतान रिहा होगा।" : "Payout releases only after Collector QC verification."}
              </div>
            )}

            {onPayBooking && view.canPayBooking && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onPayBooking}
                className="kn-btn-primary mt-4 w-full font-bold text-sm"
              >
                💳 {hi ? "बुकिंग भुगतान करें" : "Pay Booking Deposit"}
              </motion.button>
            )}

            {onConfirm && view.canConfirm && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onConfirm}
                className="kn-btn-primary kn-btn-success mt-3 w-full font-bold text-sm"
              >
                ✅ {hi ? "ऑर्डर कन्फर्म करें" : "Confirm Buyer Order"}
              </motion.button>
            )}

            {!view.hasAcceptedDemo && (
              <p className="mt-2.5 text-[11px] text-[#785d4f] text-center font-medium">
                ⚠️ {hi ? "कन्फर्म करने से पहले कारीगर से डेमो टुकड़ा स्वीकार करें।" : "Accept a sample demo piece before confirming full order."}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
