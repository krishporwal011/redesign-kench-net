"use client";

import { useEffect, useState } from "react";
import starter from "@/data/starter-list.json";
import AppHeader from "@/components/AppHeader";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import PoolCard from "@/components/PoolCard";
import { familyName } from "@/lib/labels";
import { useLanguage } from "@/lib/LanguageContext";
import { allPoolViews } from "@/lib/pool";
import { loadPilesWithQc, onStoreChange } from "@/lib/store";
import { settlementForAccepted } from "@/lib/settlement";

type BatchRecord = {
  batchId: string;
  householdId: string;
  locality: string;
  declaredQty: number;
  collectedQty: number | null;
  acceptedQty: number | null;
  rejectedQty: number | null;
  damagedQty: number | null;
  status: string;
  rejectionReason: string | null;
};

const rates = {
  artisanUnitPriceInr: starter.order.artisanUnitPriceInr || 8,
  coopFeePercent: starter.order.coopFeePercent || 5,
};

function rupees(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function batchesFromStore(): BatchRecord[] {
  return loadPilesWithQc().map((pile) => ({
    batchId: pile.batchId,
    householdId: pile.householdId,
    locality: pile.locality,
    declaredQty: pile.declaredQty,
    collectedQty: pile.collectedQty,
    acceptedQty: pile.acceptedQty,
    rejectedQty: pile.rejectedQty,
    damagedQty: pile.damagedQty,
    status: pile.status,
    rejectionReason: pile.rejectionReason,
  }));
}

export default function MoneyPage() {
  const { language, t } = useLanguage();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [pools, setPools] = useState<ReturnType<typeof allPoolViews>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function refresh() {
      setPools(allPoolViews());
      setBatches(batchesFromStore());
      setIsLoaded(true);
    }
    refresh();
    return onStoreChange(refresh);
  }, []);

  const paid = batches
    .map((pile) => {
      const line = settlementForAccepted(pile.batchId, pile.acceptedQty, rates);
      if (!line) return null;
      return { pile, line };
    })
    .filter(
      (
        row,
      ): row is {
        pile: BatchRecord;
        line: NonNullable<ReturnType<typeof settlementForAccepted>>;
      } => row !== null,
    );

  return (
    <>
      <AppHeader />
      <NeedLogin>
        {() =>
          !isLoaded ? (
            <div className="p-8 text-center text-[#785d4f]">Loading Money Pool...</div>
          ) : (
            <PageContainer className="pb-28">
              <div className="mb-8 border-b border-[#e4d9c9] pb-4">
                <span className="kn-badge kn-badge-gold uppercase text-[11px]">{t("money.badge")}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210] mt-1">
                  {t("money.title")}
                </h1>
                <p className="text-xs text-[#785d4f] mt-1">
                  {t("money.sub")}
                </p>
              </div>

              {/* Single Static Fully-Expanded Pool Card */}
              <div className="max-w-3xl mx-auto">
                {pools[0] ? (
                  <PoolCard view={pools[0]} lang={language} />
                ) : null}
              </div>

              {/* Released Payouts List */}
              <section className="mt-10 max-w-3xl mx-auto">
                <div className="border-b border-[#e4d9c9] pb-3 mb-4">
                  <h2 className="text-lg font-bold text-[#1a1210]">
                    {t("money.releasedTitle")}
                  </h2>
                  <p className="text-xs text-[#785d4f]">
                    {t("money.releasedSub")}
                  </p>
                </div>

                {paid.length === 0 ? (
                  <div className="kn-card p-6 text-center text-[#785d4f] text-xs font-bold">
                    {t("money.noPayouts")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paid.map(({ pile, line }) => (
                      <div key={pile.batchId} className="kn-card p-4 flex items-center justify-between border-[#e4d9c9] bg-[#fdf8f4]">
                        <div className="flex items-center gap-3">
                          <span className="kn-dot kn-dot-red" />
                          <div>
                            <span className="font-mono text-xs font-bold text-[#790f26]">{pile.batchId}</span>
                            <h4 className="text-xs font-bold text-[#1a1210]">
                              {familyName(pile.householdId, language)} ({pile.householdId})
                            </h4>
                            <p className="text-[11px] text-[#785d4f]">
                              {line.acceptedQty} verified pieces
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-[#2e7d5b] font-mono block">
                            {rupees(line.netInr)}
                          </span>
                          <span className="kn-badge kn-badge-success text-[10px]">
                            RELEASED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </PageContainer>
          )
        }
      </NeedLogin>
    </>
  );
}
