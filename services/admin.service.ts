// src/services/admin.service.ts

import axiosInstance from "@/lib/axios";

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

  createSAR,

  createFacultyAR,
  createFacultyMA,

  createDepartmentHead,
  createDepartmentMA,
};

export default adminService;