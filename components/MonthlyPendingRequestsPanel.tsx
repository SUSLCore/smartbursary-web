"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

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

function getFileName(path: string) {
  return path.split("\\").pop() ?? path;
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

function parseKeyboardActivation(event: KeyboardEvent<HTMLDivElement>) {
  return event.key === "Enter" || event.key === " ";
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
  const [selectedDocument, setSelectedDocument] =
    useState<MonthlyDocumentRecord | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [loadingDocumentId, setLoadingDocumentId] = useState<number | null>(
    null
  );
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    number | null
  >(null);
  const [uploadingDocumentId, setUploadingDocumentId] = useState<number | null>(
    null
  );
  const [signedRemarksById, setSignedRemarksById] = useState<
    Record<number, string>
  >({});
  const [detailNotice, setDetailNotice] = useState<NoticeState>(emptyNotice);
  const mountedRef = useRef(true);

  const loadPendingRequests = useCallback(
    async (options?: { showLoading?: boolean }) => {
      const showLoading = options?.showLoading ?? false;

      try {
        if (showLoading && mountedRef.current) {
          setLoading(true);
        }

        if (mountedRef.current) {
          setNotice(emptyNotice);
        }

        const response = await monthlyFlowService.getPendingRequests();

        if (!mountedRef.current) {
          return;
        }

        setPendingRequests(response.data ?? []);
      } catch (error) {
        console.error(error);

        if (!mountedRef.current) {
          return;
        }

        const err = error as { message?: string };
        setNotice({
          tone: "error",
          text: err.message ?? "Could not load pending monthly requests right now.",
        });
      } finally {
        if (mountedRef.current && showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    void loadPendingRequests({ showLoading: true });

    return () => {
      mountedRef.current = false;
    };
  }, [loadPendingRequests]);

  const pendingCount = pendingRequests.length;

  const handleSelectDocument = async (documentId: number) => {
    setSelectedDocumentId(documentId);
    setLoadingDocumentId(documentId);
    setSelectedDocument(null);
    setDetailNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.getMonthlyDocumentById(
        documentId
      );

      if (!mountedRef.current) {
        return;
      }

      if (response.success && response.data) {
        setSelectedDocument(response.data);
      } else {
        setDetailNotice({
          tone: "info",
          text: response.message ?? "Monthly document details are unavailable.",
        });
      }
    } catch (error) {
      console.error(error);

      if (!mountedRef.current) {
        return;
      }

      const err = error as { message?: string };
      setDetailNotice({
        tone: "error",
        text: err.message ?? "Could not load that monthly document right now.",
      });
    } finally {
      if (mountedRef.current) {
        setLoadingDocumentId((current) =>
          current === documentId ? null : current
        );
      }
    }
  };

  const handleDownloadDocument = async (
    documentId: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();
    setDownloadingDocumentId(documentId);
    setDetailNotice(emptyNotice);

    try {
      const { blob, filename } =
        await monthlyFlowService.downloadMonthlyDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename.endsWith(".xlsx") || filename.endsWith(".xls")
        ? filename
        : `${filename}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      if (mountedRef.current) {
        setDetailNotice({
          tone: "success",
          text: `Download started for document #${documentId}.`,
        });
      }
    } catch (error) {
      console.error(error);

      if (mountedRef.current) {
        const err = error as { message?: string };
        setDetailNotice({
          tone: "error",
          text: err.message ?? "Could not download that monthly document right now.",
        });
      }
    } finally {
      if (mountedRef.current) {
        setDownloadingDocumentId((current) =>
          current === documentId ? null : current
        );
      }
    }
  };

  const handleOpenSignedUpload = (
    documentId: number,
    remarks: string,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();

    if (!remarks.trim()) {
      setDetailNotice({
        tone: "info",
        text: "Please add remarks before uploading the signed document.",
      });
      return;
    }

    document.getElementById(`signed-document-input-${documentId}`)?.click();
  };

  const handleSignedDocumentSelected = async (
    documentId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();

    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const remarks = signedRemarksById[documentId]?.trim();

    if (!remarks) {
      setDetailNotice({
        tone: "info",
        text: "Please add remarks before uploading the signed document.",
      });
      return;
    }

    setUploadingDocumentId(documentId);
    setDetailNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.uploadSignedDocument(
        documentId,
        file,
        remarks
      );

      if (!mountedRef.current) {
        return;
      }

      if (response.data) {
        setSelectedDocument(response.data);
      }

      setSignedRemarksById((current) => ({
        ...current,
        [documentId]: "",
      }));

      setDetailNotice({
        tone: "success",
        text:
          response.message ??
          `Signed document uploaded successfully for document #${documentId}.`,
      });

      await loadPendingRequests();
    } catch (error) {
      console.error(error);

      if (mountedRef.current) {
        const err = error as { message?: string };
        setDetailNotice({
          tone: "error",
          text: err.message ?? "Could not upload that signed document right now.",
        });
      }
    } finally {
      if (mountedRef.current) {
        setUploadingDocumentId((current) =>
          current === documentId ? null : current
        );
      }
    }
  };

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
            Review the documents waiting in the monthly workflow. Click a
            request to load its full details, or download the file directly from
            the card.
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
          {pendingRequests.map((record) => {
            const isSelected = selectedDocumentId === record.id;
            const document = selectedDocument?.id === record.id ? selectedDocument : null;

            return (
              <div
                key={record.id}
                role="button"
                tabIndex={0}
                onClick={() => void handleSelectDocument(record.id)}
                onKeyDown={(event) => {
                  if (parseKeyboardActivation(event)) {
                    event.preventDefault();
                    void handleSelectDocument(record.id);
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
                    Signed document remarks
                    <input
                      type="text"
                      value={signedRemarksById[record.id] ?? ""}
                      onChange={(event) =>
                        setSignedRemarksById((current) => ({
                          ...current,
                          [record.id]: event.target.value,
                        }))
                      }
                      onClick={(event) => event.stopPropagation()}
                      placeholder="Enter remarks for the signed upload"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={(event) => void handleDownloadDocument(record.id, event)}
                    disabled={downloadingDocumentId === record.id}
                    className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#27b8d2]/20 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d] transition hover:border-[#27b8d2]/40 hover:bg-[#27b8d2]/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <DownloadIcon />
                    {downloadingDocumentId === record.id ? "Downloading..." : "Download"}
                  </button>
                  <button
                    type="button"
                    onClick={(event) =>
                      handleOpenSignedUpload(
                        record.id,
                        signedRemarksById[record.id] ?? "",
                        event
                      )
                    }
                    disabled={uploadingDocumentId === record.id}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <UploadIcon />
                    {uploadingDocumentId === record.id
                      ? "Uploading..."
                      : "Upload signed"}
                  </button>
                  <input
                    id={`signed-document-input-${record.id}`}
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      void handleSignedDocumentSelected(record.id, event)
                    }
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
                        value={
                          monthNames[document.month - 1] ?? `Month ${document.month}`
                        }
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
                      <DetailCard
                        label="Department ID"
                        value={document.departmentId}
                      />
                      <DetailCard label="Batch ID" value={document.batchId} />
                      <DetailCard label="Uploaded by ID" value={document.uploadedBy} />
                      <DetailCard
                        label="Batch name"
                        value={document.Batch?.name ?? "N/A"}
                      />
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
                      <DetailCard
                        label="User name"
                        value={document.User?.name ?? "N/A"}
                      />
                      <DetailCard
                        label="Register number"
                        value={document.User?.registerId ?? "N/A"}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {detailNotice && (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
            detailNotice.tone
          )}`}
        >
          {detailNotice.text}
        </div>
      )}
    </section>
  );
}
