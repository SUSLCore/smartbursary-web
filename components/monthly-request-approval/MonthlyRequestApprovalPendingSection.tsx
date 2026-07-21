"use client";

import type { MonthlyDocumentRecord } from "@/services/monthlyFlow.service";

import NoticeBanner from "./NoticeBanner";
import type { NoticeState } from "./types";
import { formatDate, formatDocumentMonth, getFileName } from "./utils";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M7 7h9a4 4 0 0 1 4 4v6M7 7l3-3M7 7l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PendingDocumentCard({
  record,
  downloadingPendingId,
  completingPendingId,
  returningPendingId,
  returnRemarks,
  onReturnRemarksChange,
  onDownload,
  onComplete,
  onReturn,
}: {
  record: MonthlyDocumentRecord;
  downloadingPendingId: number | null;
  completingPendingId: number | null;
  returningPendingId: number | null;
  returnRemarks: string;
  onReturnRemarksChange: (value: string) => void;
  onDownload: (documentId: number) => void;
  onComplete: (documentId: number) => void;
  onReturn: (documentId: number) => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
            Pending document #{record.id}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#17365d]">
            {formatDocumentMonth(record)}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {record.User?.name ?? `User ${record.uploadedBy}`} ·{" "}
            {record.Department?.name ?? `Department ${record.departmentId}`}
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Uploaded by
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {record.User?.name ?? `User ${record.uploadedBy}`}
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Batch
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {record.Batch?.name ?? record.batchId}
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Department
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {record.Department?.name ?? record.departmentId}
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            File
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {getFileName(record.currentFile)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Created at
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {formatDate(record.createdAt)}
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Updated at
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
            {formatDate(record.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="block text-sm font-medium text-[#17365d]">
          Return remarks
          <textarea
            value={returnRemarks}
            onChange={(event) => onReturnRemarksChange(event.target.value)}
            placeholder="Add a short reason for returning this file."
            rows={3}
            className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onDownload(record.id)}
            disabled={downloadingPendingId === record.id}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <DownloadIcon />
            {downloadingPendingId === record.id ? "Downloading..." : "Download"}
          </button>

          <button
            type="button"
            onClick={() => onComplete(record.id)}
            disabled={completingPendingId === record.id}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CheckCircleIcon />
            {completingPendingId === record.id ? "Completing..." : "Mark complete"}
          </button>

          <button
            type="button"
            onClick={() => onReturn(record.id)}
            disabled={returningPendingId === record.id}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ReturnIcon />
            {returningPendingId === record.id ? "Returning..." : "Return"}
          </button>

          <p className="text-xs text-slate-500">
            The return action sends the file back with the remarks you entered
            above.
          </p>
        </div>
      </div>
    </article>
  );
}

export default function MonthlyRequestApprovalPendingSection({
  pendingDocuments,
  pendingLoading,
  pendingNotice,
  downloadingPendingId,
  completingPendingId,
  returningPendingId,
  returnRemarksById,
  onReturnRemarksChange,
  onDownload,
  onComplete,
  onReturn,
  onRefresh,
}: {
  pendingDocuments: MonthlyDocumentRecord[];
  pendingLoading: boolean;
  pendingNotice: NoticeState;
  downloadingPendingId: number | null;
  completingPendingId: number | null;
  returningPendingId: number | null;
  returnRemarksById: Record<number, string>;
  onReturnRemarksChange: (documentId: number, value: string) => void;
  onDownload: (documentId: number) => void;
  onComplete: (documentId: number) => void;
  onReturn: (documentId: number) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
            Step 2
          </span>
          <h2 className="mt-1 text-xl font-semibold text-[#17365d]">
            Pending monthly files
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review the files currently waiting in the monthly queue. You can
            download a copy for inspection or return the file with remarks.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
        >
          Refresh queue
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Pending files
          </p>
          <p className="mt-1 text-2xl font-bold text-[#17365d]">
            {pendingLoading ? "..." : pendingDocuments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Current action
          </p>
          <p className="mt-1 text-sm font-semibold text-[#17365d]">
            Download or return
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Status
          </p>
          <p className="mt-1 text-sm font-semibold text-[#17365d]">
            Awaiting review
          </p>
        </div>
      </div>

      <div className="mt-4">
        <NoticeBanner state={pendingNotice} />
      </div>

      {pendingLoading ? (
        <div className="mt-6 grid gap-3">
          <div className="h-28 rounded-3xl bg-slate-100" />
          <div className="h-28 rounded-3xl bg-slate-100" />
          <div className="h-28 rounded-3xl bg-slate-100" />
        </div>
      ) : pendingDocuments.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-sm text-slate-600">
          No pending monthly files are waiting right now.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {pendingDocuments.map((record) => (
            <PendingDocumentCard
              key={record.id}
              record={record}
              downloadingPendingId={downloadingPendingId}
              completingPendingId={completingPendingId}
              returningPendingId={returningPendingId}
              returnRemarks={returnRemarksById[record.id] ?? ""}
              onReturnRemarksChange={(value) =>
                onReturnRemarksChange(record.id, value)
              }
              onDownload={onDownload}
              onComplete={onComplete}
              onReturn={onReturn}
            />
          ))}
        </div>
      )}
    </section>
  );
}
