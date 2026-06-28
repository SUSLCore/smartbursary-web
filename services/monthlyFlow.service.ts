import axiosInstance from "@/lib/axios";
import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";

export interface BatchesResponse {
  batches: Batch[];
}

export interface FacultyMADepartmentsResponse {
  success: boolean;
  data: Department[];
}

export interface MonthlyDocumentBatch {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonthlyDocumentDepartment {
  id: number;
  facultyId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonthlyDocumentUser {
  id: number;
  name: string;
  registerId: string;
}

export interface MonthlyDocumentRecord {
  id: number;
  batchId: number;
  departmentId: number;
  uploadedBy: number;
  month: number;
  year: number;
  originalFile: string;
  currentFile: string;
  currentStep: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Batch: MonthlyDocumentBatch;
  Department: MonthlyDocumentDepartment;
  User: MonthlyDocumentUser;
}

export interface MonthlyDocumentUploadPayload {
  batchId: number;
  departmentId: number;
  month: number;
  year: number;
  file: File;
}

export interface MonthlyDocumentUploadResponse {
  success: boolean;
  message: string;
  data?: MonthlyDocumentRecord;
  documentId?: number;
  canDelete?: boolean;
}

export interface MonthlyPendingDocumentsResponse {
  success: boolean;
  data: MonthlyDocumentRecord[];
}

export interface MonthlyDocumentResponse {
  success: boolean;
  data?: MonthlyDocumentRecord;
  message?: string;
}

export interface MonthlyDocumentDownloadResponse {
  blob: Blob;
  filename: string;
}

export interface MonthlyDocumentSignResponse {
  success: boolean;
  message: string;
  data?: MonthlyDocumentRecord;
}

function getFilenameFromContentDisposition(value: string | null) {
  if (!value) {
    return null;
  }

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = value.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] ?? null;
}

export const monthlyFlowService = {
  async getBatches(): Promise<BatchesResponse> {
    const response = await axiosInstance.get<BatchesResponse>("/api/batches");

    return response.data;
  },

  async getDepartments(): Promise<FacultyMADepartmentsResponse> {
    const response = await axiosInstance.get<FacultyMADepartmentsResponse>(
      "/api/faculty-ma/departments"
    );

    return response.data;
  },

  async getPendingRequests(): Promise<MonthlyPendingDocumentsResponse> {
    const response = await axiosInstance.get<MonthlyPendingDocumentsResponse>(
      "/api/monthly-documents/pending"
    );

    return response.data;
  },

  async getMonthlyDocumentById(
    documentId: number
  ): Promise<MonthlyDocumentResponse> {
    const response = await axiosInstance.get<MonthlyDocumentResponse>(
      `/api/monthly-documents/${documentId}`
    );

    return response.data;
  },

  async downloadMonthlyDocument(
    documentId: number
  ): Promise<MonthlyDocumentDownloadResponse> {
    const response = await axiosInstance.get<Blob>(
      `/api/monthly-documents/${documentId}/download`,
      {
        responseType: "blob",
      }
    );

    return {
      blob: response.data,
      filename:
        getFilenameFromContentDisposition(
          response.headers["content-disposition"] ?? null
      ) ?? `monthly-document-${documentId}`,
    };
  },

  async uploadSignedDocument(
    documentId: number,
    file: File
  ): Promise<MonthlyDocumentSignResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosInstance.put<MonthlyDocumentSignResponse>(
      `/api/monthly-documents/${documentId}/sign`,
      formData
    );

    return response.data;
  },

  async uploadInitialDocument(
    payload: MonthlyDocumentUploadPayload
  ): Promise<MonthlyDocumentUploadResponse> {
    const formData = new FormData();

    formData.append("batchId", String(payload.batchId));
    formData.append("departmentId", String(payload.departmentId));
    formData.append("month", String(payload.month));
    formData.append("year", String(payload.year));
    formData.append("file", payload.file);

    const response = await axiosInstance.post<MonthlyDocumentUploadResponse>(
      "/api/monthly-documents",
      formData
    );

    return response.data;
  },
};

export default monthlyFlowService;
