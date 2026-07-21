"use client";

import type { FormEvent, ReactNode } from "react";

import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";
import type { MonthlyDocumentRecord } from "@/services/monthlyFlow.service";

import NoticeBanner from "./NoticeBanner";
import type { NoticeState } from "./types";
import { formatMonthLabel } from "./utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, index) => CURRENT_YEAR - 2 + index);

const MONTH_OPTIONS = [
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

function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

function ResultCard({ doc }: { doc: MonthlyDocumentRecord }) {
  const monthLabel = formatMonthLabel(doc.month, doc.year);

  const statusColor =
    doc.status === "PENDING"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#27b8d2]/20 bg-[#27b8d2]/5">
      <div className="flex items-center justify-between gap-3 border-b border-[#27b8d2]/15 bg-white px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
            Upload result
          </p>
          <p className="mt-0.5 text-base font-bold text-[#17365d]">
            Document #{doc.id} - {monthLabel}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusColor}`}
        >
          {doc.status}
        </span>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 md:grid-cols-3">
        {[
          ["Batch", doc.Batch.name],
          ["Department", doc.Department.name],
          ["Uploaded by", `${doc.User.name} (${doc.User.registerId})`],
          ["Period", monthLabel],
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

export default function MonthlyRequestApprovalUploadSection({
  batches,
  departments,
  loadingMeta,
  selectedBatchId,
  selectedDepartmentId,
  selectedMonth,
  selectedYear,
  file,
  uploading,
  uploadNotice,
  uploadedDoc,
  onBatchChange,
  onDepartmentChange,
  onMonthChange,
  onYearChange,
  onFileChange,
  onSubmit,
}: {
  batches: Batch[];
  departments: Department[];
  loadingMeta: boolean;
  selectedBatchId: string;
  selectedDepartmentId: string;
  selectedMonth: string;
  selectedYear: string;
  file: File | null;
  uploading: boolean;
  uploadNotice: NoticeState;
  uploadedDoc: MonthlyDocumentRecord | null;
  onBatchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const selectedBatch =
    batches.find((batch) => String(batch.id) === selectedBatchId)?.name ?? "—";
  const selectedDepartment =
    departments.find((department) => String(department.id) === selectedDepartmentId)
      ?.name ?? "—";
  const selectedMonthLabel =
    MONTH_OPTIONS.find((month) => String(month.value) === selectedMonth)?.label ?? "—";

  return (
    <form onSubmit={onSubmit} className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
            Step 1
          </span>
          <h2 className="mt-1 text-xl font-semibold text-[#17365d]">
            Upload initial document
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose the batch, department, period, and attach the monthly Excel
            file to submit it into the approval workflow.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-[#27b8d2]/30 bg-[#27b8d2]/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
          XLSX / XLS
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Batch
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
            {selectedBatch}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Department
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
            {selectedDepartment}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Month
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
            {selectedMonthLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Year
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
            {selectedYear || "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#17365d]">
          Batch
          <SelectWrapper>
            <select
              id="monthly-batch"
              value={selectedBatchId}
              onChange={(event) => onBatchChange(event.target.value)}
              disabled={loadingMeta || batches.length === 0}
              className="mt-2 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">{loadingMeta ? "Loading..." : "Select a batch"}</option>
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
              onChange={(event) => onDepartmentChange(event.target.value)}
              disabled={loadingMeta || departments.length === 0}
              className="mt-2 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {loadingMeta ? "Loading..." : "Select a department"}
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#17365d]">
          Month
          <SelectWrapper>
            <select
              id="monthly-month"
              value={selectedMonth}
              onChange={(event) => onMonthChange(event.target.value)}
              className="mt-2 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
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
              onChange={(event) => onYearChange(event.target.value)}
              className="mt-2 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </label>
      </div>

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
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#27b8d2] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-[#17365d] file:transition-colors file:duration-200 hover:file:bg-[#17365d] hover:file:text-white"
          />

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Accepted formats: XLSX or XLS.
          </p>
        </div>
      </label>

      {file && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3 text-sm text-slate-700">
          <CheckCircleIcon />
          <span>
            Selected file:{" "}
            <span className="font-semibold text-[#17365d]">{file.name}</span>
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || loadingMeta}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#27b8d2] px-5 py-3.5 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {uploading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
            Uploading...
          </>
        ) : (
          "Upload monthly document"
        )}
      </button>

      <div className="mt-4">
        <NoticeBanner state={uploadNotice} />
      </div>

      {uploadedDoc && <ResultCard doc={uploadedDoc} />}
    </form>
  );
}
