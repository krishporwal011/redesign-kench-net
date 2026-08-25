"use client";

import { useEffect, useState } from "react";
import { colourWords } from "@/lib/labels";
import type { UiLang } from "@/lib/lang";
import {
  acceptDemo,
  getThread,
  onStoreChange,
  postChat,
  rejectDemo,
  sendDemo,
  type ChatThread,
} from "@/lib/store";
import type { Role } from "@/lib/types";

export default function ChatPanel({
  threadId,
  role,
  lang,
}: {
  threadId: string;
  role: Role;
  lang: UiLang;
}) {
  const hi = lang === "hi";
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState("");
  const [demoQty, setDemoQty] = useState(12);
  const [demoColour, setDemoColour] = useState<"ruby_red" | "blue">("ruby_red");
  const [photoUrl, setPhotoUrl] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    function refresh() {
      setThread(getThread(threadId));
    }
    refresh();
    return onStoreChange(refresh);
  }, [threadId]);

  if (!thread) {
    return <p className="text-base text-[#523a2f] p-4">{hi ? "बातचीत नहीं मिली।" : "Chat thread not found."}</p>;
  }

  function sendText() {
    postChat(threadId, role === "artisan" ? "artisan" : "buyer", text);
    setText("");
  }

  function onSendDemo() {
    sendDemo(threadId, {
      colourFamily: demoColour,
      qty: demoQty,
      photoUrl,
    });
  }

  function onPickPhoto(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function onAccept() {
    const result = acceptDemo(threadId);
    setNote(
      result.ok
        ? hi
          ? "डेमो स्वीकार किया गया। मात्रा लॉक।"
          : "Demo piece accepted. Order quantity locked."
        : result.reason ?? "",
    );
  }

  function onReject() {
    const result = rejectDemo(threadId);
    setNote(
      result.ok
        ? hi
          ? "डेमो अस्वीकार किया गया। माल पूल में उपलब्ध रहेगा।"
          : "Demo piece rejected. Pile stays in pool for other buyers."
        : result.reason ?? "",
    );
  }

  const demo = thread.demo;

  return (
    <div className="kn-card p-5 border-[#eadecf] bg-[#fffdf9] shadow-sm">
      {/* Chat Messages */}
      <div className="kn-chat-log space-y-3 p-2 rounded-2xl bg-[#fbf7f0] border border-[#eadecf]">
        {thread.messages.map((msg) => (
          <div
            key={msg.id}
            className={`kn-bubble ${msg.from === "system" ? "is-sys" : msg.from === role ? "is-me" : "is-them"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Demo Sample Status Card */}
      {demo ? (
        <div className="mt-5 p-4 rounded-2xl bg-[#fffdf9] border-2 border-[#9e2a1b]/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9e2a1b] uppercase tracking-wider">
              {hi ? "डेमो टुकड़ा (सैंपल)" : "Sample Demo Piece"}
            </span>
            <span className="kn-badge kn-badge-warning text-xs">
              {thread.demoStatus === "sent"
                ? hi ? "प्रतीक्षारत" : "Awaiting Review"
                : thread.demoStatus === "accepted"
                  ? hi ? "स्वीकृत" : "Accepted"
                  : hi ? "अस्वीकृत" : "Rejected"}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className={`kn-dot ${demo.colourFamily === "blue" ? "kn-dot-blue" : "kn-dot-red"}`} />
            <p className="text-sm font-extrabold text-[#2c1a14]">
              {colourWords(demo.colourFamily, lang)} · {demo.qty} {hi ? "टुकड़े" : "pieces"}
            </p>
          </div>

          {demo.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={demo.photoUrl} alt="Sample Demo Piece" className="mt-3 max-h-40 rounded-xl object-cover border border-[#eadecf]" />
          ) : (
            <div className={`mt-3 h-16 rounded-xl flex items-center justify-center text-xs font-bold text-white ${demo.colourFamily === "blue" ? "bg-[#1e4d7a]" : "bg-[#9e2a1b]"}`}>
              📷 {hi ? "सैंपल रंग प्रदर्शित" : "Sample Spec Visual"}
            </div>
          )}
        </div>
      ) : null}

      {/* Artisan Send Demo Controls */}
      {role === "artisan" && thread.demoStatus !== "accepted" ? (
        <div className="mt-6 pt-5 border-t border-[#eadecf]">
          <h4 className="text-sm font-extrabold text-[#2c1a14]">
            {hi ? "डेमो सैंपल भेजें" : "Send Demo Sample Piece"}
          </h4>
          <p className="text-xs text-[#523a2f] mt-0.5">
            {hi ? "खरीदार को 12-24 पीस सैंपल भेजकर पुष्टि प्राप्त करें" : "Send a small 12-24 piece batch to lock buyer commitment"}
          </p>

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setDemoColour("ruby_red")}
              className={`kn-orb kn-orb-red flex-1 ${demoColour === "ruby_red" ? "is-on" : ""}`}
            >
              {hi ? "लाल" : "Red"}
            </button>
            <button
              type="button"
              onClick={() => setDemoColour("blue")}
              className={`kn-orb kn-orb-blue flex-1 ${demoColour === "blue" ? "is-on" : ""}`}
            >
              {hi ? "नीली" : "Blue"}
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold text-[#2c1a14] mb-1">
              {hi ? "सैंपल संख्या" : "Sample Quantity"}
            </label>
            <input
              type="number"
              min={1}
              value={demoQty}
              onChange={(e) => setDemoQty(Number(e.target.value))}
              className="kn-field text-base font-mono"
            />
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold text-[#2c1a14] mb-1">
              {hi ? "फोटो अपलोड करें" : "Upload Sample Photo"}
            </label>
            <input
              type="file"
              accept="image/*"
              className="kn-field text-xs text-[#523a2f]"
              onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
            />
          </div>

          <button
            type="button"
            onClick={onSendDemo}
            className="kn-btn-primary w-full mt-4 text-sm font-extrabold"
          >
            📤 {hi ? "डेमो भेजें" : "Send Demo Sample"}
          </button>
        </div>
      ) : null}

      {/* Buyer Accept / Reject Controls */}
      {role === "buyer" && thread.demoStatus === "sent" ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="kn-btn-primary kn-btn-success text-xs font-extrabold"
          >
            ✅ {hi ? "डेमो स्वीकार करें" : "Accept Demo"}
          </button>
          <button
            type="button"
            onClick={onReject}
            className="kn-btn-secondary text-xs font-bold text-[#9b2c2c] border-red-200"
          >
            🚫 {hi ? "अस्वीकार करें" : "Reject Demo"}
          </button>
        </div>
      ) : null}

      {note ? <p className="mt-3 text-xs font-bold text-[#9e2a1b] bg-[#fbeeeC] p-2.5 rounded-xl border border-[#9e2a1b]/20">{note}</p> : null}

      {/* Text Message Input */}
      <div className="mt-5 pt-4 border-t border-[#eadecf] flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="kn-field text-sm"
          placeholder={hi ? "संदेश लिखें..." : "Type message..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendText();
          }}
        />
        <button
          type="button"
          onClick={sendText}
          className="kn-btn-primary px-4 text-sm font-bold shrink-0"
        >
          {hi ? "भेजें" : "Send"}
        </button>
      </div>
    </div>
  );
}
