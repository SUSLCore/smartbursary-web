"use client";

import Link from "next/link";

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

function SummaryChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#17365d]">
        {value}
      </p>
    </div>
  );
}

export default function MonthlyRequestApprovalHero({
  selectedBatch,
  selectedDepartment,
  selectedMonthLabel,
  selectedYear,
}: {
  selectedBatch: string;
  selectedDepartment: string;
  selectedMonthLabel: string;
  selectedYear: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />

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
            Upload the initial monthly document for your department. Select the
            correct batch, department, and period, then attach the Excel file to
            start the approval workflow.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryChip label="Batch" value={selectedBatch || "—"} />
          <SummaryChip label="Department" value={selectedDepartment || "—"} />
          <SummaryChip label="Month" value={selectedMonthLabel} />
          <SummaryChip label="Year" value={selectedYear || "—"} />
        </div>
      </div>
    </section>
  );
}
