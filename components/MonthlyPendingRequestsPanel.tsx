"use client";

import { useEffect, useState } from "react";

import monthlyFlowService, {
  type MonthlyDocumentRecord,
} from "@/services/monthlyFlow.service";

type PanelVariant = "compact" | "featured";

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

const emptyNotice: NoticeState = null;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function noticeClassName(tone: NoticeTone) {
  if (tone === "error") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
}

function formatMonth(record: MonthlyDocumentRecord) {
  const label = monthNames[record.month - 1] ?? `Month ${record.month}`;

  return `${label} ${record.year}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function MonthlyPendingRequestsPanel({
  variant = "compact",
}: {
  variant?: PanelVariant;
}) {
  const [pendingRequests, setPendingRequests] = useState<MonthlyDocumentRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(emptyNotice);

  useEffect(() => {
    let active = true;

    const loadPendingRequests = async () => {
      try {
        setLoading(true);
        setNotice(emptyNotice);

        const response = await monthlyFlowService.getPendingRequests();

        if (!active) {
          return;
        }

        setPendingRequests(response.data ?? []);
      } catch (error) {
        console.error(error);

        if (!active) {
          return;
        }

        setNotice({
          tone: "error",
          text: "Could not load pending monthly requests right now.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPendingRequests();

    return () => {
      active = false;
    };
  }, []);

  const visibleRequests = pendingRequests.slice(0, 3);
  const pendingCount = pendingRequests.length;

  const panelClassName =
    variant === "featured"
      ? "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8"
      : "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/50";

  const accentBar = (
    <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />
  );

  return (
    <section className={panelClassName}>
      {accentBar}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Monthly request queue
          </span>
          <h2
            className={`mt-3 font-bold tracking-tight text-[#17365d] ${
              variant === "featured" ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            Pending monthly requests
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review the documents that are already waiting in the monthly
            workflow. This panel is shared across all staff dashboards except
            admin and student views.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-[#17365d]">
              {loading ? "..." : pendingCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Latest
            </p>
            <p className="mt-1 text-sm font-semibold text-[#17365d]">
              {pendingRequests[0] ? formatMonth(pendingRequests[0]) : "No queue"}
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
            notice.tone
          )}`}
        >
          {notice.text}
        </div>
      )}

      {loading ? (
        <div className="mt-6 grid gap-3">
          <div className="h-20 rounded-3xl bg-slate-100" />
          <div className="h-20 rounded-3xl bg-slate-100" />
          <div className="h-20 rounded-3xl bg-slate-100" />
        </div>
      ) : pendingCount === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-600">
          No monthly requests are currently pending.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleRequests.map((record) => (
            <article
              key={record.id}
              className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 transition hover:border-[#27b8d2]/40 hover:bg-[#27b8d2]/5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                    Document #{record.id}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#17365d]">
                    {formatMonth(record)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {record.User?.name ?? `User ${record.uploadedBy}`} -{" "}
                    {record.status}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200">
                    {record.status}
                  </span>
                  <span className="rounded-full bg-[#17365d]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
                    {record.currentStep.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Uploaded by
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#17365d]">
                    {record.User?.name ?? `User ${record.uploadedBy}`}
                  </p>
                </div>

                <div className="rounded-2xl border border-white bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Step
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
                    {record.currentStep.replace(/_/g, " ")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Created
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#17365d]">
                    <ClockIcon />
                    {formatDate(record.createdAt)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {pendingCount > visibleRequests.length && (
            <p className="text-sm text-slate-500">
              Showing {visibleRequests.length} of {pendingCount} pending
              request(s).
            </p>
          )}
        </div>
      )}
    </section>
  );
}
