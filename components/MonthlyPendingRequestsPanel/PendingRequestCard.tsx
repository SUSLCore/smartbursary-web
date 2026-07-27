"use client";

import type {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

import type { MonthlyDocumentRecord } from "@/services/monthlyFlow.service";

import { MONTH_NAMES, formatDate, formatMonth, getFileName } from "./utils";

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

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-semibold text-[#17365d]">
        {value}
      </p>
    </div>
  );
}

function parseKeyboardActivation(event: KeyboardEvent<HTMLElement>) {
  if (event.target !== event.currentTarget) {
    return false;
  }

  return event.key === "Enter" || event.key === " ";
}

export default function PendingRequestCard({
  record,
  isSelected,
  selectedDocument,
  loadingDocumentId,
  sharedRemarks,
  downloadingDocumentId,
  uploadingDocumentId,
  returningPendingDocumentId,
  onSelectDocument,
  onDownloadDocument,
  onOpenSignedUpload,
  onReturnPendingDocument,
  onSharedRemarksChange,
  onSignedDocumentSelected,
}: {
  record: MonthlyDocumentRecord;
  isSelected: boolean;
  selectedDocument: MonthlyDocumentRecord | null;
  loadingDocumentId: number | null;
  sharedRemarks: string;
  downloadingDocumentId: number | null;
  uploadingDocumentId: number | null;
  returningPendingDocumentId: number | null;
  onSelectDocument: (documentId: number) => void;
  onDownloadDocument: (
    documentId: number,
    event?: MouseEvent<HTMLButtonElement>
  ) => void;
  onOpenSignedUpload: (
    documentId: number,
    remarks: string,
    event?: MouseEvent<HTMLButtonElement>
  ) => void;
  onReturnPendingDocument: (documentId: number) => void;
  onSharedRemarksChange: (value: string) => void;
  onSignedDocumentSelected: (
    documentId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  const document = selectedDocument?.id === record.id ? selectedDocument : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectDocument(record.id)}
      onKeyDown={(event) => {
        if (parseKeyboardActivation(event)) {
          event.preventDefault();
          onSelectDocument(record.id);
        }
      }}
      aria-expanded={isSelected}
      className={`w-full rounded-3xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#27b8d2]/15 ${
        isSelected
          ? "border-[#27b8d2]/50 bg-[#27b8d2]/5 shadow-sm"
          : "border-slate-200/70 bg-slate-50 hover:border-[#27b8d2]/40 hover:bg-[#27b8d2]/5"
      }`}
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
            {record.User?.name ?? `User ${record.uploadedBy}`} - {record.status}
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
        <DetailCard
          label="Uploaded by"
          value={record.User?.name ?? `User ${record.uploadedBy}`}
        />
        <DetailCard label="Batch" value={record.Batch?.name ?? record.batchId} />
        <DetailCard
          label="Department"
          value={record.Department?.name ?? record.departmentId}
        />
        <DetailCard label="File" value={getFileName(record.currentFile)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200">
          Created {formatDate(record.createdAt)}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200">
          Updated {formatDate(record.updatedAt)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="block text-sm font-medium text-[#17365d]">
          Remarks
          <textarea
            value={sharedRemarks}
            onChange={(event) => onSharedRemarksChange(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            placeholder="Enter remarks for upload signed or return."
            rows={3}
            className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDownloadDocument(record.id, event);
            }}
            disabled={downloadingDocumentId === record.id}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <DownloadIcon />
            {downloadingDocumentId === record.id ? "Downloading..." : "Download"}
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenSignedUpload(record.id, sharedRemarks, event);
            }}
            disabled={uploadingDocumentId === record.id}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <UploadIcon />
            {uploadingDocumentId === record.id ? "Uploading..." : "Upload signed"}
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onReturnPendingDocument(record.id);
            }}
            disabled={returningPendingDocumentId === record.id}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {returningPendingDocumentId === record.id ? "Returning..." : "Return"}
          </button>

          <input
            id={`signed-document-input-${record.id}`}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(event) => onSignedDocumentSelected(record.id, event)}
          />
        </div>
      </div>

      {isSelected && loadingDocumentId === record.id ? (
        <div className="mt-4 rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-600">
          Loading document details...
        </div>
      ) : null}

      {document ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="Register ID"
              value={document.User?.registerId ?? "N/A"}
            />
            <DetailCard
              label="Month"
              value={MONTH_NAMES[document.month - 1] ?? `Month ${document.month}`}
            />
            <DetailCard label="Year" value={document.year} />
            <DetailCard label="Status" value={document.status} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="Current step"
              value={document.currentStep.replace(/_/g, " ")}
            />
            <DetailCard label="Document ID" value={document.id} />
            <DetailCard
              label="Created at"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon />
                  {formatDate(document.createdAt)}
                </span>
              }
            />
            <DetailCard
              label="Updated at"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon />
                  {formatDate(document.updatedAt)}
                </span>
              }
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <DetailCard label="Current file" value={document.currentFile} />
            <DetailCard label="Original file" value={document.originalFile} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard label="Department ID" value={document.departmentId} />
            <DetailCard label="Batch ID" value={document.batchId} />
            <DetailCard label="Uploaded by ID" value={document.uploadedBy} />
            <DetailCard label="Batch name" value={document.Batch?.name ?? "N/A"} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard
              label="Department name"
              value={document.Department?.name ?? "N/A"}
            />
            <DetailCard
              label="Faculty ID"
              value={document.Department?.facultyId ?? "N/A"}
            />
            <DetailCard label="User name" value={document.User?.name ?? "N/A"} />
            <DetailCard
              label="Register number"
              value={document.User?.registerId ?? "N/A"}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
