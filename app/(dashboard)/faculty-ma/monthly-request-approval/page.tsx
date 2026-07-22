"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";
import {
  monthlyFlowService,
  type MonthlyDocumentRecord,
} from "@/services/monthlyFlow.service";

import MonthlyRequestApprovalHero from "@/components/monthly-request-approval/MonthlyRequestApprovalHero";
import MonthlyRequestApprovalPendingSection from "@/components/monthly-request-approval/MonthlyRequestApprovalPendingSection";
import MonthlyRequestApprovalUploadSection from "@/components/monthly-request-approval/MonthlyRequestApprovalUploadSection";
import NoticeBanner from "@/components/monthly-request-approval/NoticeBanner";
import { MONTH_NAMES } from "@/components/monthly-request-approval/utils";
import type { NoticeState } from "@/components/monthly-request-approval/types";

type ApiError = {
  success: boolean;
  message: string;
  documentId?: number;
  canDelete?: boolean;
};

const emptyNotice: NoticeState = null;

const toNumber = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default function MonthlyRequestApprovalPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaNotice, setMetaNotice] = useState<NoticeState>(emptyNotice);
  const [pendingDocuments, setPendingDocuments] = useState<MonthlyDocumentRecord[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingNotice, setPendingNotice] = useState<NoticeState>(emptyNotice);
  const [downloadingPendingId, setDownloadingPendingId] = useState<number | null>(null);
  const [completingPendingId, setCompletingPendingId] = useState<number | null>(null);
  const [returningPendingId, setReturningPendingId] = useState<number | null>(null);
  const [returnRemarksById, setReturnRemarksById] = useState<Record<number, string>>({});
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<NoticeState>(emptyNotice);
  const [uploadedDoc, setUploadedDoc] = useState<MonthlyDocumentRecord | null>(null);
  const mountedRef = useRef(true);

  const loadPendingDocuments = useCallback(
    async (options?: { showLoading?: boolean }) => {
      const showLoading = options?.showLoading ?? false;

      try {
        if (showLoading && mountedRef.current) {
          setPendingLoading(true);
        }

        if (mountedRef.current) {
          setPendingNotice(emptyNotice);
        }

        const response = await monthlyFlowService.getPendingRequests();

        if (!mountedRef.current) {
          return;
        }

        setPendingDocuments(response.data ?? []);
      } catch (error) {
        console.error(error);

        if (!mountedRef.current) {
          return;
        }

        const err = error as { message?: string };
        setPendingNotice({
          tone: "error",
          text: err.message ?? "Could not load pending monthly files right now.",
        });
      } finally {
        if (mountedRef.current && showLoading) {
          setPendingLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    const loadMeta = async () => {
      try {
        if (mountedRef.current) {
          setLoadingMeta(true);
          setMetaNotice(emptyNotice);
        }

        const [batchResponse, departmentResponse] = await Promise.all([
          monthlyFlowService.getBatches(),
          monthlyFlowService.getDepartments(),
        ]);

        if (!mountedRef.current) {
          return;
        }

        setBatches(batchResponse.batches ?? []);
        setDepartments(departmentResponse.data ?? []);
      } catch (error) {
        console.error(error);

        if (!mountedRef.current) {
          return;
        }

        setMetaNotice({
          tone: "error",
          text: "Could not load batches or departments. Please refresh and try again.",
        });
      } finally {
        if (mountedRef.current) {
          setLoadingMeta(false);
        }
      }
    };

    void loadMeta();
    void loadPendingDocuments({ showLoading: true });

    return () => {
      mountedRef.current = false;
    };
  }, [loadPendingDocuments]);

  const selectedBatch =
    batches.find((batch) => String(batch.id) === selectedBatchId)?.name ?? "";
  const selectedDepartment =
    departments.find((department) => String(department.id) === selectedDepartmentId)
      ?.name ?? "";
  const selectedMonthLabel =
    MONTH_NAMES[Number(selectedMonth) - 1] ?? `Month ${selectedMonth}`;

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
        setFile(null);
        void loadPendingDocuments();
        return;
      }

      const detail = response.documentId ? ` (Document ID: ${response.documentId})` : "";
      setUploadNotice({
        tone: "info",
        text: `${response.message}${detail}${response.canDelete ? " - You may delete the existing document to replace it." : ""}`,
      });
    } catch (error) {
      const apiError = error as ApiError;
      const detail = apiError.documentId ? ` (Document ID: ${apiError.documentId})` : "";

      setUploadNotice({
        tone: apiError.documentId ? "info" : "error",
        text:
          `${apiError.message ?? "Upload failed."}` +
          detail +
          (apiError.canDelete
            ? " - You may delete the existing document to replace it."
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
    } catch (error) {
      console.error(error);
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
      const response = await monthlyFlowService.completeMonthlyDocument(documentId);

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
          response.message ?? `Document #${documentId} marked as complete successfully.`,
      });
    } catch (error) {
      console.error(error);
      setPendingNotice({
        tone: "error",
        text: "Could not mark that document as complete right now.",
      });
    } finally {
      setCompletingPendingId((current) => (current === documentId ? null : current));
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
    } catch (error) {
      console.error(error);
      setPendingNotice({
        tone: "error",
        text: "Could not return that file right now.",
      });
    } finally {
      setReturningPendingId((current) => (current === documentId ? null : current));
    }
  };

  return (
    <div className="space-y-7">
      <MonthlyRequestApprovalHero
        selectedBatch={selectedBatch}
        selectedDepartment={selectedDepartment}
        selectedMonthLabel={selectedMonthLabel}
        selectedYear={selectedYear}
      />

      <NoticeBanner state={metaNotice} />

      <MonthlyRequestApprovalUploadSection
        batches={batches}
        departments={departments}
        loadingMeta={loadingMeta}
        selectedBatchId={selectedBatchId}
        selectedDepartmentId={selectedDepartmentId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        file={file}
        uploading={uploading}
        uploadNotice={uploadNotice}
        uploadedDoc={uploadedDoc}
        onBatchChange={setSelectedBatchId}
        onDepartmentChange={setSelectedDepartmentId}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onFileChange={(nextFile) => {
          setFile(nextFile);
          setUploadNotice(emptyNotice);
        }}
        onSubmit={(event) => void handleUpload(event)}
      />

      <MonthlyRequestApprovalPendingSection
        pendingDocuments={pendingDocuments}
        pendingLoading={pendingLoading}
        pendingNotice={pendingNotice}
        downloadingPendingId={downloadingPendingId}
        completingPendingId={completingPendingId}
        returningPendingId={returningPendingId}
        returnRemarksById={returnRemarksById}
        onReturnRemarksChange={(documentId, value) => {
          setReturnRemarksById((current) => ({
            ...current,
            [documentId]: value,
          }));
        }}
        onDownload={(documentId) => void handleDownloadPendingDocument(documentId)}
        onComplete={(documentId) => void handleCompletePendingDocument(documentId)}
        onReturn={(documentId) => void handleReturnPendingDocument(documentId)}
        onRefresh={() => void loadPendingDocuments({ showLoading: true })}
      />
    </div>
  );
}
