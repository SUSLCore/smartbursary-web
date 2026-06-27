import axios from "axios";
import axiosInstance from "@/lib/axios";

export interface MonthlyDocumentUploadPayload {
  batchId: number;
  departmentId: number;
  month: number;
  year: number;
  file: File;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  documentId?: number;
  canDelete?: boolean;
}

export class MonthlyFlowError extends Error {
  documentId?: number;
  canDelete?: boolean;

  constructor(message: string, options?: { documentId?: number; canDelete?: boolean }) {
    super(message);
    this.name = "MonthlyFlowError";
    this.documentId = options?.documentId;
    this.canDelete = options?.canDelete;
  }
}

export interface MonthlyDocumentEntity {
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
  Batch?: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  Department?: {
    id: number;
    facultyId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  User?: {
    id: number;
    name: string;
    registerId: string;
  };
}

export interface MonthlyDocumentUploadResponse {
  success: boolean;
  message: string;
  data: MonthlyDocumentEntity;
}

export const monthlyFlowService = {
  async uploadInitialDocument(payload: MonthlyDocumentUploadPayload) {
    try {
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
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        throw new MonthlyFlowError(
          error.response?.data.message ??
            error.message ??
            "Monthly upload failed.",
          {
            documentId: error.response?.data.documentId,
            canDelete: error.response?.data.canDelete,
          }
        );
      }

      throw new MonthlyFlowError("Unexpected server error.");
    }
  },
};
export default monthlyFlowService;
