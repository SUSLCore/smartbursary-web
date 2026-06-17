import axiosInstance from "@/lib/axios";
import { DepartmentsResponse } from "@/types/department.types";

export const facultyMAService = {
  async getDepartments() {
    const response =
      await axiosInstance.get<DepartmentsResponse>(
        "/api/faculty-ma/departments"
      );

    return response.data;
  },
};