"use client";

import { useEffect, useState } from "react";

import { Department } from "@/types/department.types";
import { facultyMAService } from "@/services/facultyMA.service";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const response =
        await facultyMAService.getDepartments();

      setDepartments(response.data);
    } catch (error) {
      const err = error as { message?: string };
      console.error(err.message ?? error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
  };
};