import { isAxiosError } from "axios";
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
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyDocumentDepartment {
  id: number;
  facultyId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
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

export interface UploadMonthlyDocumentResponse {
  success: boolean;
  message: string;
  data?: MonthlyDocumentRecord;
  documentId?: number;
  canDelete?: boolean;
}


export interface UploadMonthlyDocumentPayload {
  batchId: number;
  departmentId: number;
  month: number;
  year: number;
  file: File;
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

  async uploadInitialDocument(
    payload: UploadMonthlyDocumentPayload
  ): Promise<UploadMonthlyDocumentResponse> {
    const formData = new FormData();

    formData.append("batchId", String(payload.batchId));
    formData.append("departmentId", String(payload.departmentId));
    formData.append("month", String(payload.month));
    formData.append("year", String(payload.year));
    formData.append("file", payload.file);

    try {
      const response =
        await axiosInstance.post<UploadMonthlyDocumentResponse>(
          "/api/monthly-documents",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

      return response.data;
    } catch (error) {

      if (
        isAxiosError<UploadMonthlyDocumentResponse>(error) &&
        error.response?.status === 400 &&
        error.response.data
      ) {
        return error.response.data;
      }

      throw error;
    }
  },
};

export default monthlyFlowService;
