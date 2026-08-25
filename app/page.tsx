"use client";

import LoginForm from "@/components/LoginForm";
import PreloaderIntro from "@/components/PreloaderIntro";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { language, t } = useLanguage();
  const hi = language === "hi";

  return (
    <>
      {/* 1. Preloader Intro Animation */}
      <PreloaderIntro />

      <main className="kn-shell min-h-screen flex flex-col justify-between">
        {/* 2. Hero Section: Deep Maroon (#4A0E12) Canvas with Gold Spotlight */}
        <section className="relative bg-[#4a0e12] text-[#fbf3e7] pt-12 pb-20 px-4 sm:px-6 overflow-hidden flex-1 flex flex-col justify-center">
          {/* Radial Spotlight Glow */}
          <div className="absolute inset-0 hero-spotlight pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl w-full">
            {/* Hero Top Copy & Stacked Headline */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#fbf3e7] tracking-tight leading-none font-serif">
                {hi ? "हाथों से निर्मित," : "Crafted by Hand,"} <br />
                <span className="text-[#d4af37]">
                  {hi ? "भरोसे से जुड़ा," : "Worn with Pride,"}
                </span> <br />
                <span className="text-white">{t("app.title")}</span>
              </h1>

              <p className="text-xs sm:text-base text-[#fbf3e7]/85 font-medium max-w-lg mx-auto">
                {t("home.description")}
              </p>
            </div>

            {/* Centered Login Portal Form */}
            <div className="max-w-md sm:max-w-lg mx-auto">
              <LoginForm />
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="bg-[#4a0e12] text-[#fbf3e7]/80 py-8 px-4 sm:px-6 border-t border-[#8c1c2b] text-center text-xs space-y-1">
          <p className="font-bold text-white text-sm">{t("home.footerTitle")}</p>
          <p>{t("home.footerSub")}</p>
        </footer>
      </main>
    </>
  );
}
