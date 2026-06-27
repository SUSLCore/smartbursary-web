"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { facultyMAService } from "@/services/facultyMA.service";
import monthlyFlowService, {
  MonthlyFlowError,
  type MonthlyDocumentEntity,
} from "@/services/monthlyFlow.service";
import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";


type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  documentId?: number;
  canDelete?: boolean;
}

const emptyNotice: NoticeState = null;

const currentDate = new Date();
const currentMonth = String(currentDate.getMonth() + 1);
const currentYear = String(currentDate.getFullYear());

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M8 3.5h5.5L18 8v12.5A1.5 1.5 0 0 1 16.5 22h-8A1.5 1.5 0 0 1 7 20.5v-15A2 2 0 0 1 8 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.5V8H18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MonthlyRequestApprovalPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaNotice, setMetaNotice] = useState<NoticeState>(emptyNotice);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<NoticeState>(emptyNotice);
  const [uploadedDocument, setUploadedDocument] =
    useState<MonthlyDocumentEntity | null>(null);

  const selectedDepartment = useMemo(
    () =>
      departments.find(
        (department) => String(department.id) === selectedDepartmentId
      ) ?? null,
    [departments, selectedDepartmentId]
  );

  const selectedBatch = useMemo(
    () => batches.find((batch) => String(batch.id) === selectedBatchId) ?? null,
    [batches, selectedBatchId]
  );

  const selectedMonthLabel =
    monthOptions.find((option) => option.value === selectedMonth)?.label ??
    "Select month";

  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setMetaNotice(emptyNotice);

        const [departmentResponse, batchResponse] = await Promise.all([
          facultyMAService.getDepartments(),
          facultyMAService.getBatches(),
        ]);

        if (!active) return;

        const nextDepartments = departmentResponse.data ?? [];
        const nextBatches = batchResponse.batches ?? [];

        setDepartments(nextDepartments);
        setBatches(nextBatches);

        setSelectedDepartmentId((current) =>
          current &&
            nextDepartments.some(
              (department) => String(department.id) === current
            )
            ? current
            : String(nextDepartments[0]?.id ?? "")
        );

        setSelectedBatchId((current) =>
          current && nextBatches.some((batch) => String(batch.id) === current)
            ? current
            : String(nextBatches[0]?.id ?? "")
        );

        setMetaNotice({
          tone: "success",
          text: "Monthly departments and batches loaded successfully.",
        });
      } catch (error) {
        console.error(error);

        if (!active) return;

        setMetaNotice({
          tone: "error",
          text: "Could not load the departments or batches right now.",
        });
      } finally {
        if (active) {
          setLoadingMeta(false);
        }
      }
    };

    void loadMeta();

    return () => {
      active = false;
    };
  }, []);

  const noticeClassName = (tone: NoticeTone) => {
    if (tone === "error") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (tone === "success") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
  };

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

  const selectClassName = `${inputClassName} appearance-none pr-11`;

  const panelClassName =
    "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50";

  const accentBar = (
    <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27b8d2] to-[#17365d]" />
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const batchId = toNumber(selectedBatchId);
    const departmentId = toNumber(selectedDepartmentId);
    const month = toNumber(selectedMonth);
    const year = toNumber(selectedYear);

    if (!departmentId || !batchId || !month || !year) {
      setUploadNotice({
        tone: "error",
        text: "Please choose a batch, department, month, and year before uploading.",
      });
      return;
    }

    if (!file) {
      setUploadNotice({
        tone: "error",
        text: "Please select the monthly Excel file before uploading.",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadNotice(emptyNotice);
      setUploadedDocument(null);

      const response = await monthlyFlowService.uploadInitialDocument({
        batchId,
        departmentId,
        month,
        year,
        file,
      });

      setUploadedDocument(response.data);
      setUploadNotice({
        tone: "success",
        text: response.message,
      });
    } catch (error) {
      const uploadError =
        error instanceof MonthlyFlowError
          ? error
          : error instanceof Error
            ? error
            : null;

      console.error("Monthly upload failed:", uploadError ?? error);

      setUploadNotice({
        tone: "error",
        text:
          uploadError?.message ??
          "The monthly document upload failed. Please try again.",
      });

      if (uploadError instanceof MonthlyFlowError && uploadError.canDelete) {
        console.log("Existing Document ID:", uploadError.documentId);
      }
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-7">
      <section className={`${panelClassName} sm:p-8`}>
        {accentBar}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#17365d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
              Monthly request workflow
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
              Monthly document upload
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Upload the initial monthly document for a selected department and
              batch, then review the API response immediately inside the
              faculty-MA dashboard.
            </p>
          </div>

          <Link
            href="/faculty-ma"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
          >
            <ArrowLeftIcon />
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Departments
            </p>
            <p className="mt-1 text-lg font-semibold text-[#17365d]">
              {departments.length || "0"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Batches
            </p>
            <p className="mt-1 text-lg font-semibold text-[#17365d]">
              {batches.length || "0"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Default period
            </p>
            <p className="mt-1 text-lg font-semibold text-[#17365d]">
              {selectedMonthLabel} {selectedYear}
            </p>
          </div>
        </div>
      </section>

      {metaNotice && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
            metaNotice.tone
          )}`}
        >
          {metaNotice.text}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <form onSubmit={handleSubmit} className={`${panelClassName} sm:p-8`}>
          {accentBar}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
                Step 1
              </span>
              <h2 className="mt-1 text-xl font-semibold text-[#17365d]">
                Initial monthly document upload
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose the department and batch first, then set the month and
                year for the document you are uploading.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full border border-[#27b8d2]/30 bg-[#27b8d2]/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
              XLSX / XLS / CSV
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-[#17365d]">
              Department
              <div className="relative mt-2">
                <select
                  value={selectedDepartmentId}
                  onChange={(event) => setSelectedDepartmentId(event.target.value)}
                  disabled={loadingMeta || departments.length === 0}
                  className={selectClassName}
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </label>

            <label className="block text-sm font-medium text-[#17365d]">
              Batch
              <div className="relative mt-2">
                <select
                  value={selectedBatchId}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  disabled={loadingMeta || batches.length === 0}
                  className={selectClassName}
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-[#17365d]">
              Month
              <div className="relative mt-2">
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className={selectClassName}
                >
                  {monthOptions.map((monthOption) => (
                    <option key={monthOption.value} value={monthOption.value}>
                      {monthOption.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <CalendarIcon />
                </span>
              </div>
            </label>

            <label className="block text-sm font-medium text-[#17365d]">
              Year
              <input
                type="number"
                min={2000}
                max={2100}
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className={inputClassName}
              />
            </label>
          </div>

          <label className="mt-6 block text-sm font-medium text-[#17365d]">
            Monthly file
            <div className="mt-2 rounded-3xl border-2 border-dashed border-[#27b8d2]/30 bg-[#27b8d2]/5 p-6 text-center transition-all duration-200 hover:border-[#27b8d2]/60 hover:bg-[#27b8d2]/10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#27b8d2] shadow-sm">
                <UploadCloudIcon />
              </div>

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setUploadNotice(emptyNotice);
                }}
                className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#27b8d2] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-[#17365d] file:transition-colors file:duration-200 hover:file:bg-[#17365d] hover:file:text-white"
              />

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Upload the first monthly worksheet or sheet bundle for this
                department and batch.
              </p>
            </div>
          </label>

          {file && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3 text-sm text-slate-700">
              <FileIcon />
              Selected file:{" "}
              <span className="font-semibold text-[#17365d]">{file.name}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || loadingMeta}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#27b8d2] px-5 py-3.5 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? "Uploading..." : "Upload monthly document"}
          </button>

          {uploadNotice && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
                uploadNotice.tone
              )}`}
            >
              {uploadNotice.text}
            </div>
          )}

          {uploadedDocument && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Upload id
                </p>
                <p className="mt-1 text-xl font-semibold text-[#17365d]">
                  #{uploadedDocument.id}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-xl font-semibold text-[#17365d]">
                  {uploadedDocument.status}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Current step
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {uploadedDocument.currentStep}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Uploaded by
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {uploadedDocument.User?.name ?? `User ${uploadedDocument.uploadedBy}`}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Stored file
                </p>
                <p className="mt-1 break-all text-sm font-medium text-slate-700">
                  {uploadedDocument.currentFile}
                </p>
              </div>
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <section className={`${panelClassName} sm:p-7`}>
            {accentBar}

            <h2 className="text-xl font-semibold text-[#17365d]">
              Live selection
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These are the values that will be sent to the monthly document
              upload API.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Department
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {selectedDepartment?.name ?? "Select a department"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Batch
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {selectedBatch?.name ?? "Select a batch"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Period
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {selectedMonthLabel} {selectedYear}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  File
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17365d]">
                  {file?.name ?? "No file chosen"}
                </p>
              </div>
            </div>
          </section>

          <section className={`${panelClassName} sm:p-7`}>
            {accentBar}

            <h2 className="text-xl font-semibold text-[#17365d]">
              What gets uploaded
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The form sends a multipart payload to the monthly document API
              with the exact fields the backend expects.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                ["batchId", "Selected batch"],
                ["departmentId", "Selected department"],
                ["month", "Selected month"],
                ["year", "Selected year"],
                ["file", "Monthly Excel file"],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl bg-[#e9ebf2]/40 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#17365d]">{key}</p>
                  <p className="text-sm text-slate-600">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
