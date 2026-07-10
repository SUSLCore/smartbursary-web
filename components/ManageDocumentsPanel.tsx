"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmationCard from "@/components/ConfirmationCard";
import {
  deleteMonthlyDocument,
  getMonthlyDocuments,
  type MonthlyDocumentRecord,
} from "@/services/admin.service";

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function getFileName(path: string) {
  return path.split("\\").pop() ?? path;
}

function noticeClassName(tone: NoticeTone) {
  if (tone === "error") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (tone === "success") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
}

function DocumentField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-slate-200">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-semibold text-[#17365d]">
        {value}
      </p>
    </div>
  );
}

export default function ManageDocumentsPanel() {
  const router = useRouter();
  const [documents, setDocuments] = useState<MonthlyDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [deleteTarget, setDeleteTarget] = useState<MonthlyDocumentRecord | null>(
    null
  );
  const [activeStatus, setActiveStatus] = useState("ALL");

  useEffect(() => {
    let mounted = true;

    const loadDocuments = async () => {
      try {
        setNotice(null);
        const response = await getMonthlyDocuments();

        if (!mounted) {
          return;
        }

        setDocuments(response.data ?? []);
      } catch (error: unknown) {
        if (!mounted) {
          return;
        }

        setNotice({
          tone: "error",
          text:
            (error as { message?: string }).message ??
            "Could not load monthly documents right now.",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadDocuments();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedDocuments = useMemo(
    () =>
      [...documents].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [documents]
  );

  const statusOptions = useMemo(() => {
    const statuses = new Set(sortedDocuments.map((document) => document.status));

    return ["ALL", ...Array.from(statuses).sort()];
  }, [sortedDocuments]);

  const filteredDocuments = useMemo(() => {
    return sortedDocuments.filter((document) => {
      const matchesStatus =
        activeStatus === "ALL" || document.status === activeStatus;

      if (!matchesStatus) {
        return false;
      }

      return true;
    });
  }, [activeStatus, sortedDocuments]);

  const statusCounts = useMemo(() => {
    return sortedDocuments.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.status] = (accumulator[item.status] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [sortedDocuments]);

  const handleDeleteDocument = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeletingId(deleteTarget.id);
      setNotice(null);

      const response = await deleteMonthlyDocument(deleteTarget.id);

      setNotice({
        tone: "success",
        text:
          response.message ??
          `Monthly document #${deleteTarget.id} deleted successfully.`,
      });

      setDeleteTarget(null);

      const refreshed = await getMonthlyDocuments();
      setDocuments(refreshed.data ?? []);
    } catch (error: unknown) {
      setNotice({
        tone: "error",
        text:
          (error as { message?: string }).message ??
          "Could not delete that monthly document.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#eef2f7] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] bg-[#17365d] p-8 text-white shadow-[0_14px_35px_rgba(23,54,93,0.24)]">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#27b8d2]/20" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#27b8d2] ring-1 ring-white/15">
                  <span className="h-2 w-2 rounded-full bg-[#27b8d2]" />
                  Document control
                </span>

                <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                  Manage monthly documents
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                  Review uploaded monthly documents, inspect their metadata, and
                  remove records when they are no longer needed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
              >
                <ArrowLeftIcon />
                Back to admin
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#17365d] px-4 py-4 text-white shadow-sm ring-1 ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold">{sortedDocuments.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-4 text-white shadow-sm ring-1 ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Pending
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {statusCounts.PENDING ?? 0}
                </p>
              </div>
              <div className="rounded-2xl bg-[#27b8d2]/15 px-4 py-4 text-white shadow-sm ring-1 ring-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Filtered
                </p>
                <p className="mt-1 text-2xl font-bold">{filteredDocuments.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_35px_rgba(23,54,93,0.12)] ring-1 ring-slate-200">
          <div className="bg-[#f8fafc] p-6 sm:p-9">
            {notice && (
              <div
                className={`mb-5 rounded-2xl px-4 py-3 text-sm ${noticeClassName(
                  notice.tone
                )}`}
              >
                {notice.text}
              </div>
            )}

            <div className="mb-5 flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const isActive = activeStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                      isActive
                        ? "bg-[#17365d] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#27b8d2]/40 hover:bg-[#27b8d2]/5 hover:text-[#17365d]"
                    }`}
                  >
                    {status === "ALL" ? "All" : status}{" "}
                    {status === "ALL" ? "" : `(${statusCounts[status] ?? 0})`}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="rounded-[28px] border border-dashed border-[#27b8d2]/30 bg-white px-6 py-8 text-sm text-[#17365d]/70">
                Loading monthly documents...
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#27b8d2]/30 bg-white px-6 py-8 text-sm text-[#17365d]/70">
                No monthly documents match the current search and filter.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDocuments.map((document) => (
                  <article
                    key={document.id}
                    className="overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_10px_28px_rgba(23,54,93,0.08)] ring-1 ring-slate-200 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                          Document #{document.id}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-[#17365d]">
                          {formatMonth(document)}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {document.User?.name ?? `User ${document.uploadedBy}`} -{" "}
                          {document.Department?.name ?? `Department ${document.departmentId}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {document.status}
                        </span>
                        <span className="rounded-full bg-[#17365d]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
                          {document.currentStep.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <DocumentField
                        label="Batch"
                        value={document.Batch?.name ?? document.batchId}
                      />
                      <DocumentField
                        label="Department"
                        value={document.Department?.name ?? document.departmentId}
                      />
                      <DocumentField
                        label="Uploader"
                        value={document.User?.registerId ?? document.uploadedBy}
                      />
                      <DocumentField label="Month" value={document.month} />
                      <DocumentField label="Year" value={document.year} />
                      <DocumentField
                        label="Current file"
                        value={getFileName(document.currentFile)}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <DocumentField
                        label="Original file"
                        value={getFileName(document.originalFile)}
                      />
                      <DocumentField
                        label="Updated at"
                        value={formatDate(document.updatedAt)}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(document)}
                        disabled={deletingId === document.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <TrashIcon />
                        {deletingId === document.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmationCard
        open={Boolean(deleteTarget)}
        title="Delete this monthly document?"
        description={
          deleteTarget
            ? `This will permanently delete document #${deleteTarget.id} for ${formatMonth(
                deleteTarget
              )}. This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={Boolean(deleteTarget && deletingId === deleteTarget.id)}
        destructive
        onConfirm={() => void handleDeleteDocument()}
        onCancel={() => {
          if (deleteTarget && deletingId === deleteTarget.id) {
            return;
          }

          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
