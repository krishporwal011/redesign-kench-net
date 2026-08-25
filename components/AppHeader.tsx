"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { clearSession, readSession } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";
import type { SessionUser } from "@/lib/types";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    setUser(readSession());
  }, [pathname]);

  function logout() {
    clearSession();
    router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#3d0a11] text-[#faf0e4] border-b border-[#790f26]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={user?.home ?? "/"}
            className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-[#faf0e4] hover:text-white transition font-serif min-h-[44px]"
          >
            <span className="inline-block h-7 w-7 rounded-full bg-[#c9aa35] text-[#3d0a11] text-center text-sm leading-7 font-black font-sans shrink-0">
              क
            </span>
            <span className="font-extrabold font-sans">Kanch-Net</span>
          </Link>

          {/* Controls & Desktop Navigation */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <nav className="hidden sm:flex items-center gap-1.5 mr-2 font-sans">
                {user.role === "artisan" && (
                  <Link
                    href="/artisan"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      pathname === "/artisan" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {t("header.home")}
                  </Link>
                )}
                {user.role === "buyer" && (
                  <>
                    <Link
                      href="/buyer"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/buyer" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.buyerLot")}
                    </Link>
                    <Link
                      href="/money"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/money" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.escrowPool")}
                    </Link>
                  </>
                )}
                {user.role === "collector" && (
                  <>
                    <Link
                      href="/pickup"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/pickup" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.pickupQc")}
                    </Link>
                    <Link
                      href="/money"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/money" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.payouts")}
                    </Link>
                  </>
                )}
                {user.role === "coordinator" && (
                  <>
                    <Link
                      href="/matching"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/matching" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.matchingEngine")}
                    </Link>
                    <Link
                      href="/map"
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        pathname === "/map" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t("header.mandiMap")}
                    </Link>
                  </>
                )}
              </nav>
            ) : null}

            {/* Global Language Switcher Button (44px min touch height on mobile) */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={language === "en" ? "Switch language to Hindi" : "Switch language to English"}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#c9aa35] text-[#3d0a11] px-3 min-h-[44px] text-xs font-extrabold shadow-2xs hover:bg-[#b5982b] transition cursor-pointer active:scale-95 shrink-0"
            >
              <span>🌐</span>
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="text-white/80 hover:text-white text-xs font-semibold min-h-[44px] px-2 flex items-center underline underline-offset-2 shrink-0"
              >
                {t("header.logout")}
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <BottomNav />
    </>
  );
}
