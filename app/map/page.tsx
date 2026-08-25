"use client";

import AppHeader from "@/components/AppHeader";
import FirozabadMap from "@/components/FirozabadMap";
import NeedLogin from "@/components/NeedLogin";
import PageContainer from "@/components/PageContainer";
import { useLanguage } from "@/lib/LanguageContext";

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <>
      <AppHeader />
      <NeedLogin>
        {() => (
          <PageContainer className="max-w-4xl pb-28">
            <div className="border-b border-[#e4d9c9] pb-3 mb-6">
              <span className="kn-badge kn-badge-gold uppercase text-[10px]">Geographic Mandi</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1210] mt-1">{t("map.title")}</h1>
              <p className="text-xs text-[#785d4f] mt-1">
                {t("map.sub")}
              </p>
            </div>
            <FirozabadMap />
          </PageContainer>
        )}
      </NeedLogin>
    </>
  );
}
