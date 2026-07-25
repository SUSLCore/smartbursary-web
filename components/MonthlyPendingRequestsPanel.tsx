"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import monthlyFlowService, {
  type MonthlyDocumentRecord,
  type MonthlyMyUploadItem,
} from "@/services/monthlyFlow.service";

import PendingRequestCard from "@/components/MonthlyPendingRequestsPanel/PendingRequestCard";
import PreviousUploadsSection from "@/components/MonthlyPendingRequestsPanel/PreviousUploadsSection";
import type { NoticeState } from "@/components/MonthlyPendingRequestsPanel/types";
import { noticeClassName } from "@/components/MonthlyPendingRequestsPanel/utils";

type PanelVariant = "compact" | "featured";

const emptyNotice: NoticeState = null;

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
  const [loadingMyUploads, setLoadingMyUploads] = useState(false);
  const [showMyUploads, setShowMyUploads] = useState(false);
  const [myUploads, setMyUploads] = useState<MonthlyMyUploadItem[]>([]);
  const [myUploadsNotice, setMyUploadsNotice] =
    useState<NoticeState>(emptyNotice);
  const [replacingDocumentId, setReplacingDocumentId] = useState<number | null>(
    null
  );
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    number | null
  >(null);
  const [uploadingDocumentId, setUploadingDocumentId] = useState<number | null>(
    null
  );
  const [sharedRemarksById, setSharedRemarksById] = useState<
    Record<number, string>
  >({});
  const [pendingReturnRemarksById, setPendingReturnRemarksById] = useState<
    Record<number, string>
  >({});
  const [returningPendingDocumentId, setReturningPendingDocumentId] = useState<
    number | null
  >(null);
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
    event?: MouseEvent<HTMLButtonElement>
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

  const handleLoadMyUploads = async () => {
    setShowMyUploads(true);
    setLoadingMyUploads(true);
    setMyUploadsNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.getMyUploads();

      if (!mountedRef.current) {
        return;
      }

      setMyUploads(response.data ?? []);

      if ((response.data ?? []).length === 0) {
        setMyUploadsNotice({
          tone: "info",
          text: "You have no previous uploads yet.",
        });
      }
    } catch (error) {
      console.error(error);

      if (!mountedRef.current) {
        return;
      }

      const err = error as { message?: string };
      setMyUploadsNotice({
        tone: "error",
        text: err.message ?? "Could not load your previous uploads right now.",
      });
    } finally {
      if (mountedRef.current) {
        setLoadingMyUploads(false);
      }
    }
  };

  const handleOpenReplaceUpload = (
    documentId: number,
    event?: MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();

    document.getElementById(`replace-document-input-${documentId}`)?.click();
  };

  const handleReplaceDocumentSelected = async (
    documentId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();

    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setMyUploadsNotice({
        tone: "error",
        text: "Only .xlsx files are allowed for document replacement.",
      });
      return;
    }

    setReplacingDocumentId(documentId);
    setMyUploadsNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.replaceMonthlyDocument(
        documentId,
        file
      );

      if (!mountedRef.current) {
        return;
      }

      await handleLoadMyUploads();

      if (mountedRef.current) {
        setMyUploadsNotice({
          tone: "success",
          text:
            response.message ??
            `Document #${documentId} replaced successfully.`,
        });
      }
    } catch (error) {
      console.error(error);

      if (!mountedRef.current) {
        return;
      }

      const err = error as { message?: string };
      setMyUploadsNotice({
        tone: "error",
        text: err.message ?? "Could not replace that document right now.",
      });
    } finally {
      if (mountedRef.current) {
        setReplacingDocumentId((current) =>
          current === documentId ? null : current
        );
      }
    }
  };

  const handleOpenSignedUpload = (
    documentId: number,
    remarks: string,
    event?: MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();

    if (!remarks.trim()) {
      setDetailNotice({
        tone: "error",
        text: "Please add remarks before uploading the signed document.",
      });
      return;
    }

    document.getElementById(`signed-document-input-${documentId}`)?.click();
  };

  const handleReturnPendingDocument = async (documentId: number) => {
    const remarks = pendingReturnRemarksById[documentId]?.trim();

    if (!remarks) {
      setDetailNotice({
        tone: "error",
        text: "Please add return remarks before sending the file back.",
      });
      return;
    }

    setReturningPendingDocumentId(documentId);
    setDetailNotice(emptyNotice);

    try {
      const response = await monthlyFlowService.returnMonthlyDocument(
        documentId,
        remarks
      );

      if (!mountedRef.current) {
        return;
      }

      setDetailNotice({
        tone: "success",
        text:
          response.message ?? `Document #${documentId} returned successfully.`,
      });

      setPendingReturnRemarksById((current) => ({
        ...current,
        [documentId]: "",
      }));

      await loadPendingRequests();
    } catch (error) {
      console.error(error);

      if (mountedRef.current) {
        const err = error as { message?: string };
        setDetailNotice({
          tone: "error",
          text: err.message ?? "Could not return that file right now.",
        });
      }
    } finally {
      if (mountedRef.current) {
        setReturningPendingDocumentId((current) =>
          current === documentId ? null : current
        );
      }
    }
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

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setDetailNotice({
        tone: "error",
        text: "Only .xlsx files are allowed for signed document upload.",
      });
      return;
    }

    const remarks = sharedRemarksById[documentId]?.trim();

    if (!remarks) {
      setDetailNotice({
        tone: "error",
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

      setSharedRemarksById((current) => ({
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
          <button
            type="button"
            onClick={() => void handleLoadMyUploads()}
            className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3 text-left transition hover:border-[#27b8d2]/40 hover:bg-[#27b8d2]/5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Previous upload
            </p>
            <p className="mt-1 text-sm font-semibold text-[#17365d]">
              {loadingMyUploads ? "Loading..." : "Click to load cards"}
            </p>
          </button>
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

      {showMyUploads && (
        <PreviousUploadsSection
          loadingMyUploads={loadingMyUploads}
          myUploads={myUploads}
          myUploadsNotice={myUploadsNotice}
          replacingDocumentId={replacingDocumentId}
          onLoadMyUploads={() => void handleLoadMyUploads()}
          onReplaceUpload={handleOpenReplaceUpload}
          onReplaceSelected={handleReplaceDocumentSelected}
        />
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
          {pendingRequests.map((record) => (
            <PendingRequestCard
              key={record.id}
              record={record}
              isSelected={selectedDocumentId === record.id}
              selectedDocument={selectedDocument}
              loadingDocumentId={loadingDocumentId}
              sharedRemarks={sharedRemarksById[record.id] ?? ""}
              downloadingDocumentId={downloadingDocumentId}
              uploadingDocumentId={uploadingDocumentId}
              returningPendingDocumentId={returningPendingDocumentId}
              onSelectDocument={(documentId) => void handleSelectDocument(documentId)}
              onDownloadDocument={(documentId, event) =>
                void handleDownloadDocument(documentId, event)
              }
              onOpenSignedUpload={handleOpenSignedUpload}
              onReturnPendingDocument={(documentId) =>
                void handleReturnPendingDocument(documentId)
              }
              onSharedRemarksChange={(value) =>
                setSharedRemarksById((current) => ({
                  ...current,
                  [record.id]: value,
                }))
              }
              onSignedDocumentSelected={handleSignedDocumentSelected}
            />
          ))}
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
