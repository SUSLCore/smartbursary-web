"use client";

import type { ChangeEvent, MouseEvent } from "react";

import type { MonthlyMyUploadItem } from "@/services/monthlyFlow.service";

import type { NoticeState } from "./types";
import { formatMyUploadPeriod, noticeClassName } from "./utils";

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

function PreviousUploadCard({
  item,
  replacingDocumentId,
  onReplaceUpload,
  onReplaceSelected,
}: {
  item: MonthlyMyUploadItem;
  replacingDocumentId: number | null;
  onReplaceUpload: (
    documentId: number,
    event?: MouseEvent<HTMLButtonElement>
  ) => void;
  onReplaceSelected: (
    documentId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div className="rounded-3xl border border-white bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
            Upload #{item.id}
          </p>
          <h4 className="mt-1 text-lg font-bold text-[#17365d]">
            {formatMyUploadPeriod(item)}
          </h4>
          <p className="mt-1 text-sm text-slate-600">
            Batch {item.batch} - Department {item.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            {item.status}
          </span>
          <span className="rounded-full bg-[#17365d]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
            {item.currentStep.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <DetailCard label="Document ID" value={item.id} />
        <DetailCard label="Batch ID" value={item.batch} />
        <DetailCard label="Department ID" value={item.department} />
        <DetailCard label="Month" value={item.month} />
        <DetailCard label="Year" value={item.year} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <DetailCard
          label="Current step"
          value={item.currentStep.replace(/_/g, " ")}
        />
        <DetailCard label="Waiting for" value={item.waitingFor} />
        <DetailCard label="Can replace" value={item.canReplace ? "Yes" : "No"} />
        <DetailCard label="Uploaded at" value={item.uploadedAt} />
        <DetailCard label="Status" value={item.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={(event) => onReplaceUpload(item.id, event)}
          disabled={!item.canReplace || replacingDocumentId === item.id}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadIcon />
          {replacingDocumentId === item.id ? "Replacing..." : "Replace"}
        </button>
        <input
          id={`replace-document-input-${item.id}`}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(event) => onReplaceSelected(item.id, event)}
        />
        {!item.canReplace && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            Replacement disabled
          </span>
        )}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
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

export default function PreviousUploadsSection({
  loadingMyUploads,
  myUploads,
  myUploadsNotice,
  replacingDocumentId,
  onLoadMyUploads,
  onReplaceUpload,
  onReplaceSelected,
}: {
  loadingMyUploads: boolean;
  myUploads: MonthlyMyUploadItem[];
  myUploadsNotice: NoticeState;
  replacingDocumentId: number | null;
  onLoadMyUploads: () => void;
  onReplaceUpload: (
    documentId: number,
    event?: MouseEvent<HTMLButtonElement>
  ) => void;
  onReplaceSelected: (
    documentId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-[#27b8d2]/20 bg-[#27b8d2]/5 p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
            My uploads
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#17365d]">
            Previous uploads
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            The response returned by the my uploads endpoint is shown below.
          </p>
        </div>
        <button
          type="button"
          onClick={onLoadMyUploads}
          className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200"
        >
          {loadingMyUploads ? "Loading..." : `${myUploads.length} record(s)`}
        </button>
      </div>

      {myUploadsNotice && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
            myUploadsNotice.tone
          )}`}
        >
          {myUploadsNotice.text}
        </div>
      )}

      {!loadingMyUploads && myUploads.length > 0 && (
        <div className="mt-4 grid gap-3">
          {myUploads.map((item) => (
            <PreviousUploadCard
              key={item.id}
              item={item}
              replacingDocumentId={replacingDocumentId}
              onReplaceUpload={onReplaceUpload}
              onReplaceSelected={onReplaceSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
}
