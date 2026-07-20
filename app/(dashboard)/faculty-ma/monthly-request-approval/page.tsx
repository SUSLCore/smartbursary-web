"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";
import {
  monthlyFlowService,
  type MonthlyDocumentRecord,
} from "@/services/monthlyFlow.service";

/* ─── Constants ──────────────────────────────────────── */

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 2 + i);

/* ─── Small helper types ─────────────────────────────── */

function formatMonth(record: MonthlyDocumentRecord) {
  const label =
    MONTHS.find((month) => month.value === record.month)?.label ??
    `Month ${record.month}`;

  return `${label} ${record.year}`;
}

function getFileName(path: string) {
  return path.split("\\").pop() ?? path;
}

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

interface ApiError {
  success: boolean;
  message: string;
  documentId?: number;
  canDelete?: boolean;
}

const emptyNotice: NoticeState = null;

const toNumber = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

/* ─── SVG icons (inline, no extra dep) ──────────────── */

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M11 5 5 12l6 7M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M7 17a4 4 0 0 1-1-7.87A5 5 0 0 1 16.9 8.1 4.5 4.5 0 0 1 16.5 17H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11v7m0-7 2.5 2.5M12 11 9.5 13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

/* ─── Shared style tokens ────────────────────────────── */

const panelClassName =
  "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8";

const accentBar = (
  <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />
);

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

const selectClassName = `${inputClassName} appearance-none pr-11`;

function noticeClassName(tone: NoticeTone) {
  if (tone === "error") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "success")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
}

/* ─── Sub-components ─────────────────────────────────── */

function Notice({ state }: { state: NoticeState }) {
  if (!state) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(state.tone)}`}
    >
      {state.tone === "success" ? <CheckCircleIcon /> : <InfoIcon />}
      <span>{state.text}</span>
    </div>
  );
}

function SelectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

/* ─── Upload-result card ─────────────────────────────── */

function ResultCard({ doc }: { doc: MonthlyDocumentRecord }) {
  const monthLabel =
    MONTHS.find((m) => m.value === doc.month)?.label ?? String(doc.month);

  const statusColor =
    doc.status === "PENDING"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#27b8d2]/20 bg-[#27b8d2]/5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#27b8d2]/15 bg-white px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
            Upload result
          </p>
          <p className="mt-0.5 text-base font-bold text-[#17365d]">
            Document #{doc.id} — {monthLabel} {doc.year}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusColor}`}
        >
          {doc.status}
        </span>
      </div>

      {/* Body */}
      <div className="grid gap-3 p-6 sm:grid-cols-2 md:grid-cols-3">
        {[
          ["Batch", doc.Batch.name],
          ["Department", doc.Department.name],
          ["Uploaded by", `${doc.User.name} (${doc.User.registerId})`],
          ["Period", `${monthLabel} ${doc.year}`],
          ["Current step", doc.currentStep.replace(/_/g, " ")],
          ["Document ID", String(doc.id)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 font-semibold text-[#17365d]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function MonthlyRequestFlowPage() {
  /* Metadata */
  const [batches, setBatches] = useState<Batch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaNotice, setMetaNotice] = useState<NoticeState>(emptyNotice);
  const [pendingDocuments, setPendingDocuments] = useState<MonthlyDocumentRecord[]>(
    []
  );
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingNotice, setPendingNotice] = useState<NoticeState>(emptyNotice);
  const [downloadingPendingId, setDownloadingPendingId] = useState<
    number | null
  >(null);
  const [completingPendingId, setCompletingPendingId] = useState<number | null>(
    null
  );
  const [returningPendingId, setReturningPendingId] = useState<number | null>(
    null
  );
  const [returnRemarksById, setReturnRemarksById] = useState<
    Record<number, string>
  >({});

  /* Form fields */
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR));
  const [file, setFile] = useState<File | null>(null);

  /* Upload state */
  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<NoticeState>(emptyNotice);
  const [uploadedDoc, setUploadedDoc] = useState<MonthlyDocumentRecord | null>(
    null
  );

  /* Derived display values */
  const selectedBatch = batches.find((b) => String(b.id) === selectedBatchId);
  const selectedDepartment = departments.find(
    (d) => String(d.id) === selectedDepartmentId
  );
  const selectedMonthLabel =
    MONTHS.find((m) => String(m.value) === selectedMonth)?.label ?? "—";

  const loadPendingDocuments = useCallback(
    async (options?: { showLoading?: boolean }) => {
      const showLoading = options?.showLoading ?? false;

      try {
        if (showLoading) {
          setPendingLoading(true);
        }

        setPendingNotice(emptyNotice);

        const response = await monthlyFlowService.getPendingRequests();

        setPendingDocuments(response.data ?? []);
      } catch (err) {
        console.error(err);
        setPendingNotice({
          tone: "error",
          text: "Could not load pending monthly files right now.",
        });
      } finally {
        if (showLoading) {
          setPendingLoading(false);
        }
      }
    },
    []
  );

  /* Load batches + departments on mount */
  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setMetaNotice(emptyNotice);

        const [batchRes, deptRes] = await Promise.all([
          monthlyFlowService.getBatches(),
          monthlyFlowService.getDepartments(),
        ]);

        if (!active) return;

        const nextBatches = batchRes.batches ?? [];
        const nextDepts = deptRes.data ?? [];

        setBatches(nextBatches);
        setDepartments(nextDepts);

        setSelectedBatchId((cur) =>
          cur && nextBatches.some((b) => String(b.id) === cur)
            ? cur
            : String(nextBatches[0]?.id ?? "")
        );

        setSelectedDepartmentId((cur) =>
          cur && nextDepts.some((d) => String(d.id) === cur)
            ? cur
            : String(nextDepts[0]?.id ?? "")
        );

        setMetaNotice({
          tone: "success",
          text: `Loaded ${nextBatches.length} batch(es) and ${nextDepts.length} department(s).`,
        });
      } catch (err) {
        console.error(err);
        if (!active) return;
        setMetaNotice({
          tone: "error",
          text: "Could not load batches or departments. Please refresh and try again.",
        });
      } finally {
        if (active) setLoadingMeta(false);
      }
    };

    void loadMeta();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    void loadPendingDocuments({ showLoading: true });
  }, [loadPendingDocuments]);

  /* Upload handler */
  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedBatchId = toNumber(selectedBatchId);
    const parsedDepartmentId = toNumber(selectedDepartmentId);
    const parsedMonth = toNumber(selectedMonth);
    const parsedYear = toNumber(selectedYear);

    if (!file) {
      setUploadNotice({
        tone: "error",
        text: "Please select an Excel file before uploading.",
      });
      return;
    }

    if (!parsedBatchId || !parsedDepartmentId || !parsedMonth || !parsedYear) {
      setUploadNotice({
        tone: "error",
        text: "Please fill in all required fields before uploading.",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadNotice(emptyNotice);
      setUploadedDoc(null);

      const response = await monthlyFlowService.uploadInitialDocument({
        batchId: parsedBatchId,
        departmentId: parsedDepartmentId,
        month: parsedMonth,
        year: parsedYear,
        file,
      });

      if (response.success && response.data) {
        setUploadedDoc(response.data);
        setUploadNotice({ tone: "success", text: response.message });
        /* Reset file input */
        setFile(null);
        void loadPendingDocuments();
      } else {
        /* Duplicate-document scenario */
        const detail =
          response.documentId
            ? ` (Document ID: ${response.documentId})`
            : "";
        setUploadNotice({
          tone: "info",
          text: `${response.message}${detail}${response.canDelete ? " — You may delete the existing document to replace it." : ""}`,
        });
      }
    } catch (err: unknown) {

      const error = err as ApiError;

      const detail =
        error.documentId
          ? ` (Document ID: ${error.documentId})`
          : "";

      setUploadNotice({
        tone: error.documentId ? "info" : "error",
        text:
          `${error.message ?? "Upload failed."}` +
          detail +
          (error.canDelete
            ? " — You may delete the existing document to replace it."
            : ""),
      });

    } finally {

      setUploading(false);

    }
  };

  const handleDownloadPendingDocument = async (documentId: number) => {
    setDownloadingPendingId(documentId);
    setPendingNotice(emptyNotice);

    try {
      const { blob, filename } =
        await monthlyFlowService.downloadMonthlyDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download =
        filename.endsWith(".xlsx") || filename.endsWith(".xls")
          ? filename
          : `${filename}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      setPendingNotice({
        tone: "success",
        text: `Download started for document #${documentId}.`,
      });
    } catch (err) {
      console.error(err);
      setPendingNotice({
        tone: "error",
        text: "Could not download that pending file right now.",
      });
    } finally {
      setDownloadingPendingId((current) => (current === documentId ? null : current));
    }
  };

  const handleCompletePendingDocument = async (documentId: number) => {
    setCompletingPendingId(documentId);
    setPendingNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.completeMonthlyDocument(
        documentId
      );

      setPendingDocuments((current) =>
        current.filter((document) => document.id !== documentId)
      );

      setReturnRemarksById((current) => {
        const next = { ...current };
        delete next[documentId];
        return next;
      });

      setPendingNotice({
        tone: "success",
        text:
          response.message ??
          `Document #${documentId} marked as complete successfully.`,
      });
    } catch (err) {
      console.error(err);
      setPendingNotice({
        tone: "error",
        text: "Could not mark that document as complete right now.",
      });
    } finally {
      setCompletingPendingId((current) =>
        current === documentId ? null : current
      );
    }
  };

  const handleReturnPendingDocument = async (documentId: number) => {
    const remarks = returnRemarksById[documentId]?.trim();

    if (!remarks) {
      setPendingNotice({
        tone: "error",
        text: "Please add return remarks before sending the file back.",
      });
      return;
    }

    setReturningPendingId(documentId);
    setPendingNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.returnMonthlyDocument(
        documentId,
        remarks
      );

      setPendingNotice({
        tone: "success",
        text: response.message ?? `Document #${documentId} returned successfully.`,
      });

      setReturnRemarksById((current) => ({
        ...current,
        [documentId]: "",
      }));

      await loadPendingDocuments();
    } catch (err) {
      console.error(err);
      setPendingNotice({
        tone: "error",
        text: "Could not return that file right now.",
      });
    } finally {
      setReturningPendingId((current) =>
        current === documentId ? null : current
      );
    }
  };

  /* ─── Render ──────────────────────────────────────── */

  return (
    <div className="space-y-7">
      {/* ── Page header ── */}
      <section className={panelClassName}>
        {accentBar}

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#17365d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Monthly document flow
          </span>

          <Link
            href="/faculty-ma"
            className="inline-flex items-center gap-2 rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
          >
            <ArrowLeftIcon />
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
              Monthly request flow
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Upload the initial monthly document for your department. Select
              the correct batch, department, and period, then attach the Excel
              file to start the approval workflow.
            </p>
          </div>

          {/* Live preview chips */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Batch", selectedBatch?.name ?? "—"],
              ["Department", selectedDepartment?.name ?? "—"],
              ["Month", selectedMonthLabel],
              ["Year", selectedYear || "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meta-load notice */}
      <Notice state={metaNotice} />

      {/* ── Upload form ── */}
      <form onSubmit={handleUpload} className={panelClassName}>
        {accentBar}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Step 1
            </span>
            <h2 className="mt-1 text-xl font-semibold text-[#17365d]">
              Upload initial document
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose the batch, department, period, and attach the monthly
              Excel file to submit it into the approval workflow.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-[#27b8d2]/30 bg-[#27b8d2]/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
            XLSX / XLS
          </span>
        </div>

        {/* Row 1 — Batch + Department */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-[#17365d]">
            Batch
            <SelectWrapper>
              <select
                id="monthly-batch"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                disabled={loadingMeta || batches.length === 0}
                className={selectClassName}
              >
                <option value="">
                  {loadingMeta ? "Loading…" : "Select a batch"}
                </option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </label>

          <label className="block text-sm font-medium text-[#17365d]">
            Department
            <SelectWrapper>
              <select
                id="monthly-department"
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                disabled={loadingMeta || departments.length === 0}
                className={selectClassName}
              >
                <option value="">
                  {loadingMeta ? "Loading…" : "Select a department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </label>
        </div>

        {/* Row 2 — Month + Year */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-[#17365d]">
            Month
            <SelectWrapper>
              <select
                id="monthly-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={selectClassName}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </label>

          <label className="block text-sm font-medium text-[#17365d]">
            Year
            <SelectWrapper>
              <select
                id="monthly-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={selectClassName}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </label>
        </div>

        {/* File drop area */}
        <label className="mt-6 block text-sm font-medium text-[#17365d]">
          Monthly Excel file
          <div className="mt-2 rounded-3xl border-2 border-dashed border-[#27b8d2]/30 bg-[#27b8d2]/5 p-6 text-center transition-all duration-200 hover:border-[#27b8d2]/60 hover:bg-[#27b8d2]/10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#27b8d2] shadow-sm">
              <UploadCloudIcon />
            </div>

            <input
              id="monthly-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setUploadNotice(emptyNotice);
              }}
              className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#27b8d2] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-[#17365d] file:transition-colors file:duration-200 hover:file:bg-[#17365d] hover:file:text-white"
            />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Accepted formats: XLSX or XLS.
            </p>
          </div>
        </label>

        {/* Selected-file pill */}
        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3 text-sm text-slate-700">
            <CheckCircleIcon />
            <span>
              Selected file:{" "}
              <span className="font-semibold text-[#17365d]">{file.name}</span>
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || loadingMeta}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#27b8d2] px-5 py-3.5 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="31.4"
                  strokeDashoffset="10"
                />
              </svg>
              Uploading…
            </>
          ) : (
            "Upload monthly document"
          )}
        </button>

        {/* Upload notice */}
        <div className="mt-4">
          <Notice state={uploadNotice} />
        </div>

        {/* Upload result card */}
        {uploadedDoc && <ResultCard doc={uploadedDoc} />}
      </form>

      <section className={panelClassName}>
        {accentBar}

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
            onClick={() => void loadPendingDocuments({ showLoading: true })}
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
          <Notice state={pendingNotice} />
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
              <article
                key={record.id}
                className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                      Pending document #{record.id}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#17365d]">
                      {formatMonth(record)}
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
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(record.createdAt))}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Updated at
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(record.updatedAt))}
                    </p>
                  </div>
                </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="block text-sm font-medium text-[#17365d]">
                      Return remarks
                    <textarea
                      value={returnRemarksById[record.id] ?? ""}
                      onChange={(event) =>
                        setReturnRemarksById((current) => ({
                          ...current,
                          [record.id]: event.target.value,
                        }))
                      }
                      placeholder="Add a short reason for returning this file."
                      rows={3}
                      className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10"
                    />
                  </label>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void handleDownloadPendingDocument(record.id)}
                      disabled={downloadingPendingId === record.id}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <DownloadIcon />
                      {downloadingPendingId === record.id
                        ? "Downloading..."
                        : "Download"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleCompletePendingDocument(record.id)}
                      disabled={completingPendingId === record.id}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <CheckCircleIcon />
                      {completingPendingId === record.id
                        ? "Completing..."
                        : "Mark complete"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleReturnPendingDocument(record.id)}
                      disabled={returningPendingId === record.id}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <ReturnIcon />
                      {returningPendingId === record.id
                        ? "Returning..."
                        : "Return"}
                    </button>

                    <p className="text-xs text-slate-500">
                      The return action sends the file back with the remarks you
                      entered above.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
