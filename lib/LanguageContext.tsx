"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getTranslation, type Language } from "@/lib/translations";

const STORAGE_KEY = "kanch-net-language";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "hi" || stored === "en") {
        setLanguageState(stored);
      }
    } catch {
      // Fallback to default "en"
    }
  }, []);

  function setLanguage(nextLang: Language) {
    setLanguageState(nextLang);
    try {
      localStorage.setItem(STORAGE_KEY, nextLang);
      // Sync legacy role keys if needed
      localStorage.setItem("kanch-lang-artisan", nextLang);
      localStorage.setItem("kanch-lang-buyer", nextLang);
      localStorage.setItem("kanch-lang-coordinator", nextLang);
      localStorage.setItem("kanch-lang-collector", nextLang);
      window.dispatchEvent(new Event("kanch-language-change"));
    } catch {
      // localStorage fallback
    }
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "hi" : "en");
  }

  function t(key: string, params?: Record<string, string | number>): string {
    return getTranslation(language, key, params);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      <div className={`transition-opacity duration-200 ${isMounted ? "opacity-100" : "opacity-95"}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, params?: Record<string, string | number>) => getTranslation("en", key, params),
    };
  }
  return context;
}
