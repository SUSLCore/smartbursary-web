import axiosInstance from "@/lib/axios";
import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";

export interface FacultyMADepartmentsResponse {
  success: boolean;
  data: Department[];
}

export interface BatchesResponse {
  batches: Batch[];
}

export interface EligibleStudent {
  id: number;
  registerId: string;
  studentName: string;
  accountNumber?: string;
  amount?: string;
}

export interface UploadEligibleStudentsPayload {
  file: File;
  batchId: number;
  facultyId: number;
  departmentId: number;
}

export interface UploadEligibleStudentsResponse {
  success: boolean;
  message: string;
  batchId: number;
  departmentId: number;
  totalStudents: number;
}

export interface DepartmentStudentsResponse {
  success: boolean;
  count: number;
  data: EligibleStudent[];
}

export interface CheckEligibilityResponse {
  eligible: boolean;
  student?: {
    id: number;
    registerId: string;
    studentName: string;
  };
}

export interface RemoveEligibleStudentResponse {
  success: boolean;
  message: string;
}

export const facultyMAService = {
  async getBatches() {
    const response = await axiosInstance.get<BatchesResponse>("/api/batches");

    return response.data;
  },

  async getDepartments() {
    const response = await axiosInstance.get<FacultyMADepartmentsResponse>(
      "/api/faculty-ma/departments"
    );

    return response.data;
  },

  async uploadEligibleStudents(payload: UploadEligibleStudentsPayload) {
    const formData = new FormData();

    formData.append("file", payload.file);
    formData.append("batchId", String(payload.batchId));
    formData.append("facultyId", String(payload.facultyId));
    formData.append("departmentId", String(payload.departmentId));

    const response = await axiosInstance.post<UploadEligibleStudentsResponse>(
      "/api/eligible-students/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async getDepartmentStudents(departmentId: number, batchId: number) {
    const response = await axiosInstance.get<DepartmentStudentsResponse>(
      `/api/eligible-students/department/${departmentId}/batch/${batchId}`
    );

    return response.data;
  },

  async checkEligibility(registerId: string) {
    const response = await axiosInstance.get<CheckEligibilityResponse>(
      `/api/eligible-students/check/${registerId}`
    );

    return response.data;
  },

  async removeEligibleStudent(id: number) {
    const response = await axiosInstance.patch<RemoveEligibleStudentResponse>(
      `/api/eligible-students/${id}/remove`
    );

    return response.data;
  },
};
