"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findUser, saveSession } from "@/lib/auth";
import { useLanguage } from "@/lib/LanguageContext";

const QUICK_USERS = [
  { phone: "9000000001", code: "1111", label: "Ramesh (Artisan · Red)", role: "artisan" },
  { phone: "9000000003", code: "3333", label: "Imran (Artisan · Blue)", role: "artisan" },
  { phone: "9000000030", code: "3030", label: "Wholesale Buyer", role: "buyer" },
  { phone: "9000000010", code: "1010", label: "Collector (QC)", role: "collector" },
  { phone: "9000000020", code: "2020", label: "Coordinator (Staff)", role: "coordinator" },
];

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pulseInputs, setPulseInputs] = useState(false);
  const { t } = useLanguage();

  function triggerAuth(targetPhone: string, targetCode: string) {
    setError("");
    setStatus("loading");

    const validUser = findUser(targetPhone, targetCode);

    if (validUser) {
      // 900ms delivery truck drive across -> 300ms checkmark spring -> 400ms hold -> route push
      setTimeout(() => {
        setStatus("success");
      }, 950);

      setTimeout(() => {
        saveSession({
          phone: validUser.phone,
          role: validUser.role as "artisan" | "collector" | "coordinator" | "buyer",
          householdId: validUser.householdId,
          name: validUser.name,
          home: validUser.home,
        });
        router.push(validUser.home);
      }, 1650);
    } else {
      // Auth failure stall + shake animation
      setTimeout(() => {
        setStatus("error");
        setError(t("login.error"));
        setTimeout(() => setStatus("idle"), 600);
      }, 800);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (status !== "idle") return;
    triggerAuth(phone, code);
  }

  function handleQuickSelect(item: typeof QUICK_USERS[0]) {
    setPhone(item.phone);
    setCode(item.code);
    setError("");
    setPulseInputs(true);
    setTimeout(() => setPulseInputs(false), 500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-2xl border border-[#e4d9c9] bg-[#FCF8F5] shadow-[0_1px_2px_rgba(68,19,20,0.15),0_20px_40px_rgba(68,19,20,0.25)] relative overflow-hidden"
    >
      <div className="mb-5">
        <h2 className="text-xl font-black text-[#1A1210] font-serif">{t("login.title")}</h2>
        <p className="text-xs font-medium text-[#785d4f] mt-0.5">
          {t("login.subtitle")}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Phone Number Field */}
        <div>
          <label className="block text-xs font-bold text-[#1A1210] uppercase tracking-wider mb-1.5">
            {t("login.phoneLabel")}
          </label>
          <motion.input
            animate={pulseInputs ? { scale: [1, 1.02, 1], backgroundColor: ["#FCF8F5", "#FBF7F1", "#FCF8F5"] } : {}}
            transition={{ duration: 0.3 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            autoComplete="tel"
            placeholder={t("login.phonePlaceholder")}
            className="w-full h-11 px-3.5 rounded-xl border-1.5 border-[#d0c2b0] bg-white text-base tracking-wide font-mono text-[#1A1210] focus:border-[#6F1B28] focus:ring-3 focus:ring-[#6F1B28]/12 outline-none transition-all duration-150"
            required
            disabled={status !== "idle"}
          />
        </div>

        {/* Code / PIN Field */}
        <div>
          <label className="block text-xs font-bold text-[#1A1210] uppercase tracking-wider mb-1.5">
            {t("login.codeLabel")}
          </label>
          <motion.input
            animate={pulseInputs ? { scale: [1, 1.02, 1], backgroundColor: ["#FCF8F5", "#FBF7F1", "#FCF8F5"] } : {}}
            transition={{ duration: 0.3 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            type="password"
            placeholder={t("login.codePlaceholder")}
            className="w-full h-11 px-3.5 rounded-xl border-1.5 border-[#d0c2b0] bg-white text-base tracking-widest font-mono text-[#1A1210] focus:border-[#6F1B28] focus:ring-3 focus:ring-[#6F1B28]/12 outline-none transition-all duration-150"
            required
            disabled={status !== "idle"}
          />
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-50 border border-[#6F1B28]/20 text-xs font-bold text-[#6F1B28]"
          >
            ⚠️ {error}
          </motion.div>
        ) : null}

        {/* Enter Portal Button with Delivery Truck Loading & Checkmark Success */}
        <motion.button
          whileTap={status === "idle" ? { scale: 0.98 } : {}}
          type="submit"
          disabled={status !== "idle"}
          className={`relative w-full h-12 rounded-xl font-black text-sm text-white overflow-hidden transition-all duration-200 shadow-md ${
            status === "error"
              ? "bg-[#6F1B28] animate-bounce"
              : status === "success"
              ? "bg-[#2E7D5B]"
              : "bg-[#6F1B28] hover:bg-[#441314]"
          }`}
        >
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center justify-center gap-2"
              >
                <span>{t("login.submit")}</span>
                <span>➔</span>
              </motion.span>
            )}

            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center px-4"
              >
                {/* Truck Trail Particles */}
                <motion.div
                  initial={{ x: 0, opacity: 0.8 }}
                  animate={{ x: "85%", opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="flex items-center gap-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-[#BD8F89]/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BD8F89]/40" />
                </motion.div>

                {/* Animated Truck Driving Left-to-Right */}
                <motion.div
                  initial={{ x: "-10%", rotate: 0, y: 0 }}
                  animate={{
                    x: ["0%", "80%"],
                    rotate: [0, 1.5, -1.5, 1, 0],
                    y: [0, -1, 1, 0],
                  }}
                  transition={{
                    x: { duration: 0.9, ease: "easeInOut" },
                    rotate: { duration: 0.9, ease: "linear" },
                    y: { duration: 0.9, ease: "linear" },
                  }}
                  className="flex items-center gap-1 text-white font-bold"
                >
                  {/* Delivery Truck SVG Icon */}
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                transition={{ duration: 0.35, ease: "backOut" }}
                className="inline-flex items-center justify-center gap-2 font-black text-white text-base"
              >
                <span>✓</span>
                <span>Portal Ready!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>

      {/* Quick Demo Accounts Selector */}
      <div className="mt-6 pt-5 border-t border-[#e4d9c9]">
        <p className="text-xs font-bold text-[#785d4f] uppercase tracking-wider mb-2.5">
          {t("login.quickDemo")}
        </p>
        <div className="space-y-2">
          {QUICK_USERS.map((item) => {
            const isDarkTag = item.role === "buyer" || item.role === "collector";
            return (
              <motion.button
                key={item.phone}
                whileHover={{ x: 3, backgroundColor: "#FBF7F1" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleQuickSelect(item)}
                className="w-full text-left p-2.5 rounded-xl border border-[#e4d9c9] bg-[#FCF8F5] transition flex items-center justify-between text-xs font-extrabold text-[#1A1210]"
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] font-mono text-white px-2.5 py-0.5 rounded-md font-bold shadow-2xs border border-white/20`}
                  style={{
                    backgroundColor: isDarkTag ? "#6F1B28" : "#BD8F89",
                  }}
                >
                  {item.role}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
