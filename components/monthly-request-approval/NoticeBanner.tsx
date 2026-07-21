"use client";

import type { NoticeState } from "./types";

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 12l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v1m0 3v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function noticeClassName(tone: NonNullable<NoticeState>["tone"]) {
  if (tone === "error") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
}

export default function NoticeBanner({ state }: { state: NoticeState }) {
  if (!state) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
        state.tone
      )}`}
    >
      {state.tone === "success" ? <CheckCircleIcon /> : <InfoIcon />}
      <span>{state.text}</span>
    </div>
  );
}
