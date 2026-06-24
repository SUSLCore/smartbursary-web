// src/services/admin.service.ts

import axiosInstance from "@/lib/axios";
import type { AuthUser } from "@/features/auth/authTypes";

/* =========================
   TYPES
========================= */

export interface CreateOfficerPayload {
  name: string;
  registerId: string;
  email: string;
  password: string;
  role:
    | "STUDENT_SERVICE_SAR"
    | "FACULTY_AR"
    | "FACULTY_MA"
    | "DEPARTMENT_HEAD"
    | "DEPARTMENT_MA";
}

export interface Faculty {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  facultyId: number;
}

export interface AdminUserLookupResponse {
  success?: boolean;
  message?: string;
  user?: AuthUser;
  data?: AuthUser;
}

export interface AdminActionResponse {
  success?: boolean;
  message?: string;
}

/* =========================
   FACULTY APIs
========================= */

export const getFaculties = async (): Promise<Faculty[]> => {
  const { data } = await axiosInstance.get("/api/faculties");
  return data;
};

export const getDepartmentsByFaculty = async (
  facultyId: number
): Promise<Department[]> => {
  const { data } = await axiosInstance.get(
    `/api/faculties/${facultyId}/departments`
  );

  return data;
};

export const getUserByRegisterId = async (
  registerId: string
): Promise<AuthUser> => {
  const { data } = await axiosInstance.get<AdminUserLookupResponse | AuthUser>(
    `/api/admin/users/${encodeURIComponent(registerId)}`
  );

  if (data && typeof data === "object" && "user" in data && data.user) {
    return data.user;
  }

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as AuthUser;
};

export const deleteUserByRegisterId = async (
  registerId: string
): Promise<AdminActionResponse> => {
  const { data } = await axiosInstance.delete<AdminActionResponse>(
    `/api/admin/users/${encodeURIComponent(registerId)}`
  );

  return data;
};

/* =========================
   UNIVERSITY OFFICERS
========================= */

export const createSAR = async (
  payload: CreateOfficerPayload
) => {
  const { data } = await axiosInstance.post(
    "/api/officers/university-officers",
    payload
  );

  return data;
};

/* =========================
   FACULTY OFFICERS
========================= */

export const createFacultyAR = async (
  facultyId: number,
  payload: CreateOfficerPayload
) => {
  const { data } = await axiosInstance.post(
    `/api/officers/faculties/${facultyId}/officers`,
    payload
  );

  return data;
};

export const createFacultyMA = async (
  facultyId: number,
  payload: CreateOfficerPayload
) => {
  const { data } = await axiosInstance.post(
    `/api/officers/faculties/${facultyId}/officers`,
    payload
  );

  return data;
};

/* =========================
   DEPARTMENT OFFICERS
========================= */

export const createDepartmentHead = async (
  departmentId: number,
  payload: CreateOfficerPayload
) => {
  const { data } = await axiosInstance.post(
    `/api/officers/departments/${departmentId}/officers`,
    payload
  );

  return data;
};

export const createDepartmentMA = async (
  departmentId: number,
  payload: CreateOfficerPayload
) => {
  const { data } = await axiosInstance.post(
    `/api/officers/departments/${departmentId}/officers`,
    payload
  );

  return data;
};

/* =========================
   EXPORT SERVICE
========================= */

const adminService = {
  getFaculties,
  getDepartmentsByFaculty,
  getUserByRegisterId,
  deleteUserByRegisterId,

  createSAR,

  createFacultyAR,
  createFacultyMA,

  createDepartmentHead,
  createDepartmentMA,
};

export default adminService;
