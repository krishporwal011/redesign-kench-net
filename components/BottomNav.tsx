"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";
import type { SessionUser } from "@/lib/types";

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setUser(readSession());
  }, [pathname]);

  if (!user) return null;

  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf9]/95 backdrop-blur-md border-t border-[#eadecf] px-3 py-2 shadow-lg sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {user.role === "artisan" && (
          <>
            <Link
              href="/artisan"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/artisan" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="text-[11px]">{t("nav.home")}</span>
            </Link>
            <Link
              href="/phone"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/phone" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">📦</span>
              <span className="text-[11px]">{t("nav.piles")}</span>
            </Link>
            <Link
              href="/chat"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname.startsWith("/chat") ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">💬</span>
              <span className="text-[11px]">{t("nav.chat")}</span>
            </Link>
          </>
        )}

        {user.role === "buyer" && (
          <>
            <Link
              href="/buyer"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/buyer" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">🛍️</span>
              <span className="text-[11px]">{t("nav.orders")}</span>
            </Link>
            <Link
              href="/money"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/money" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">💰</span>
              <span className="text-[11px]">{t("nav.money")}</span>
            </Link>
            <Link
              href="/chat"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname.startsWith("/chat") ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">💬</span>
              <span className="text-[11px]">{t("nav.chat")}</span>
            </Link>
          </>
        )}

        {user.role === "collector" && (
          <>
            <Link
              href="/pickup"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname.startsWith("/pickup") ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">🚚</span>
              <span className="text-[11px]">{t("nav.pickup")}</span>
            </Link>
            <Link
              href="/money"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/money" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">💰</span>
              <span className="text-[11px]">{t("nav.money")}</span>
            </Link>
          </>
        )}

        {user.role === "coordinator" && (
          <>
            <Link
              href="/matching"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname.startsWith("/matching") ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">⚡</span>
              <span className="text-[11px]">{t("nav.matching")}</span>
            </Link>
            <Link
              href="/map"
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                pathname === "/map" ? "text-[#9e2a1b] font-bold" : "text-[#785d4f]"
              }`}
            >
              <span className="text-xl">🗺️</span>
              <span className="text-[11px]">{t("nav.map")}</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
