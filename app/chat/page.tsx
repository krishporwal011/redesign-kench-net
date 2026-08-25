"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ChatPanel from "@/components/ChatPanel";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import { colourWords, familyName } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import {
  artisanChatPile,
  ensureThread,
  loadDemands,
  loadPiles,
  loadThreads,
  onStoreChange,
} from "@/lib/store";
import type { SessionUser } from "@/lib/types";

function ChatHome({ user }: { user: SessionUser }) {
  const { language, t } = useLanguage();
  const params = useSearchParams();
  const demandId = params.get("demandId") ?? "";
  const batchId = params.get("batchId") ?? "";
  const [tick, setTick] = useState(0);

  useEffect(() => {
    return onStoreChange(() => setTick((n) => n + 1));
  }, []);

  const piles = useMemo(() => loadPiles(), [tick]);
  const demands = useMemo(() => loadDemands(), [tick]);
  const threads = useMemo(() => loadThreads(), [tick]);

  const openId = useMemo(() => {
    if (!demandId || !batchId) return "";
    const pile = piles.find((p) => p.batchId === batchId);
    if (!pile) return "";
    return ensureThread({
      demandId,
      batchId,
      householdId: pile.householdId,
    }).threadId;
  }, [demandId, batchId, piles]);

  if (user.role !== "artisan" && user.role !== "buyer") {
    return <p className="p-6 text-[#523a2f] text-center font-bold text-sm">Chat is available for artisan households and wholesale buyers.</p>;
  }

  if (openId) {
    const pile = piles.find((p) => p.batchId === batchId);
    const demand = demands.find((d) => d.demandId === demandId);
    return (
      <PageContainer className="max-w-3xl pb-28">
        <div className="border-b border-[#e4d9c9] pb-3 mb-6">
          <span className="kn-badge kn-badge-gold uppercase text-[10px]">Active Thread</span>
          <h1 className="text-2xl font-black text-[#1a1210] mt-1">{language === "hi" ? "बातचीत" : "Chat Channel"}</h1>
          <p className="text-xs font-bold text-[#790f26] mt-0.5">
            {demand
              ? `${colourWords(demand.colourFamily, language)} · ${demand.quantityNeeded} pcs`
              : demandId}
            {pile ? ` · Household ${familyName(pile.householdId, language)}` : ""}
          </p>
        </div>
        <ChatPanel threadId={openId} role={user.role} lang={language} />
      </PageContainer>
    );
  }

  const artisanPile =
    user.role === "artisan" ? artisanChatPile(piles, user.householdId || "") : null;

  return (
    <PageContainer className="max-w-4xl pb-28">
      <div className="border-b border-[#e4d9c9] pb-3 mb-6">
        <span className="kn-badge kn-badge-gold uppercase text-[10px]">Communication</span>
        <h1 className="text-2xl font-black text-[#1a1210] mt-1">{t("chat.title")}</h1>
        <p className="text-xs text-[#785d4f] mt-0.5">
          {t("chat.sub")}
        </p>
      </div>

      {user.role === "artisan" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {demands.map((d) => {
            const pile = artisanPile;
            const href = pile
              ? `/chat?demandId=${encodeURIComponent(d.demandId)}&batchId=${encodeURIComponent(pile.batchId)}`
              : "";
            return (
              <div key={d.demandId} className="kn-card p-4 flex items-center justify-between border-[#e4d9c9] bg-[#fdf8f4]">
                <div className="flex items-center gap-3">
                  <span className={`kn-dot ${d.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                  <div>
                    <p className="text-xs font-bold text-[#1a1210]">
                      {colourWords(d.colourFamily, language)} · {d.quantityNeeded} pcs
                    </p>
                    <p className="text-[11px] text-[#785d4f]">Size {d.size} · {d.locality}</p>
                  </div>
                </div>
                {href ? (
                  <Link href={href} className="kn-btn-primary text-xs py-1.5 px-3">
                    💬 Chat
                  </Link>
                ) : (
                  <span className="text-[11px] font-bold text-[#785d4f]">Post stock first</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {threads.length === 0 ? (
            <div className="col-span-full kn-card p-6 text-center text-[#785d4f] text-xs font-bold">
              {language === "hi" ? "अभी कोई बातचीत नहीं है।" : "No chat threads yet. Open chat from stock list."}
            </div>
          ) : (
            threads.map((th) => {
              const pile = piles.find((p) => p.batchId === th.batchId);
              return (
                <div key={th.threadId} className="kn-card p-4 flex items-center justify-between border-[#e4d9c9] bg-[#fdf8f4]">
                  <div className="flex items-center gap-3">
                    <span className={`kn-dot ${pile?.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
                    <div>
                      <span className="font-mono text-xs font-bold text-[#790f26]">{th.batchId}</span>
                      <p className="text-xs font-bold text-[#1a1210]">
                        {pile ? familyName(pile.householdId, language) : th.batchId}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/chat?demandId=${encodeURIComponent(th.demandId)}&batchId=${encodeURIComponent(th.batchId)}`}
                    className="kn-btn-primary text-xs py-1.5 px-3"
                  >
                    💬 Chat
                  </Link>
                </div>
              );
            })
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default function ChatPage() {
  return (
    <>
      <AppHeader />
      <NeedLogin>
        {(user) => (
          <Suspense fallback={<div className="p-6 text-center text-[#785d4f] text-xs">Loading Chat...</div>}>
            <ChatHome user={user} />
          </Suspense>
        )}
      </NeedLogin>
    </>
  );
}
