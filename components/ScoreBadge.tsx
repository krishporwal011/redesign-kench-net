import { reliabilityScore } from "@/lib/score";
import type { UiLang } from "@/lib/lang";

export default function ScoreBadge({
  householdId,
  lang,
}: {
  householdId: string;
  lang: UiLang;
}) {
  const score = reliabilityScore(householdId);
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b4332] border border-[#2d6a4f]/20 text-[11px] font-bold">
      <span>🛡️</span>
      <span>{lang === "hi" ? "विश्वसनीयता" : "Reliability"}</span>
      <span className="font-mono text-xs font-black">{score}</span>
    </span>
  );
}
