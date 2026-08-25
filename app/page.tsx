"use client";

import AggregationVisualizer from "@/components/AggregationVisualizer";
import CollageSection from "@/components/CollageSection";
import CraftRibbon3D from "@/components/CraftRibbon3D";
import GlassmorphicStage from "@/components/GlassmorphicStage";
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

      <main className="kn-shell min-h-screen">
        {/* 2. Hero Section: Deep Maroon (#4A0E12) Canvas with Gold Spotlight */}
        <section className="relative bg-[#4a0e12] text-[#fbf3e7] pt-10 pb-16 px-4 sm:px-6 overflow-hidden border-b border-[#8c1c2b]">
          {/* Radial Spotlight Glow */}
          <div className="absolute inset-0 hero-spotlight pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl">
            {/* Hero Top Copy & Stacked Headline */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-black uppercase tracking-wider">
                ✨ {hi ? "फिरोजाबाद काँच क्राफ्ट सप्लाई नेटवर्क" : "Firozabad Glass Supply Aggregation Engine"}
              </span>

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

            {/* Main Hero Grid: Floating 3D Product Mockup + Login Portal */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Hero Column: Floating Product Render & Concept Badge */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-6">
                <div className="relative inline-block mx-auto lg:mx-0">
                  {/* Floating Product Badge Mockup */}
                  <div className="hero-mockup-float p-6 rounded-3xl bg-gradient-to-br from-[#8c1c2b] to-[#4a0e12] border-2 border-[#d4af37]/40 shadow-2xl space-y-4 max-w-sm mx-auto lg:mx-0">
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <span className="text-xs font-mono font-bold text-[#d4af37]">LOT #ORD-001</span>
                      <span className="kn-badge kn-badge-gold text-[10px]">Ruby Red</span>
                    </div>

                    <div className="py-4 text-center">
                      <span className="text-5xl font-black block font-serif text-white">क</span>
                      <span className="text-xl font-black text-[#d4af37] mt-2 block">
                        10,000 {hi ? "काँच चूड़ियाँ" : "Glass Bangles"}
                      </span>
                      <span className="text-xs text-white/80 mt-0.5 block font-mono">
                        Size 2-6 · Plain Glossy · Grade B+
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs">
                      <span>{hi ? "आपूर्तिकर्ता:" : "Supplier:"}</span>
                      <span className="font-bold text-[#d4af37]">
                        {hi ? "16 घरेलू परिवार" : "16 Artisan Households"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: Login Portal Form */}
              <div className="lg:col-span-6 space-y-4">
                <LoginForm />

                {/* Collapsible Test Account Help */}
                <details className="kn-card p-4 border-[#e4d9c9] bg-[#fffdf9] text-xs text-[#523a2f]">
                  <summary className="cursor-pointer font-bold text-sm text-[#1a1210] flex items-center justify-between">
                    <span>💡 {hi ? "डेमो सहायता और लॉगिन जानकारी" : "Demo help & test credentials"}</span>
                    <span className="text-xs text-[#8c1c2b]">▾</span>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-[#e4d9c9] space-y-2 font-mono text-xs">
                    <p className="flex justify-between">
                      <span>9000000001 / 1111</span>
                      <span className="font-bold text-[#8c1c2b] font-sans">Ramesh — artisan</span>
                    </p>
                    <p className="flex justify-between">
                      <span>9000000003 / 3333</span>
                      <span className="font-bold text-[#8c1c2b] font-sans">Imran — artisan (blue)</span>
                    </p>
                    <p className="flex justify-between">
                      <span>9000000030 / 3030</span>
                      <span className="font-bold text-[#8c1c2b] font-sans">Buyer — wholesale</span>
                    </p>
                    <p className="flex justify-between">
                      <span>9000000010 / 1010</span>
                      <span className="font-bold text-[#8c1c2b] font-sans">Collector — pickup QC</span>
                    </p>
                    <p className="flex justify-between">
                      <span>9000000020 / 2020</span>
                      <span className="font-bold text-[#8c1c2b] font-sans">Coordinator — matching</span>
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Transition into Warm Ivory (#FBF3E7) Background */}
        <div className="bg-[#fbf3e7] text-[#1a1210] px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-5xl space-y-12">
            {/* Process Aggregation Visualizer */}
            <AggregationVisualizer />

            {/* Overlapping Photo Collage Section */}
            <CollageSection />

            {/* 3D Extruded Craft Ribbon Engine */}
            <CraftRibbon3D />

            {/* Glassmorphic Stage & Escrow Guarantee */}
            <GlassmorphicStage />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="bg-[#4a0e12] text-[#fbf3e7]/80 py-8 px-4 sm:px-6 border-t border-[#8c1c2b] text-center text-xs space-y-1">
          <p className="font-bold text-white text-sm">{t("home.footerTitle")}</p>
          <p>{t("home.footerSub")}</p>
        </footer>
      </main>
    </>
  );
}
