"use client";

import { useEffect, useState } from "react";
import {
  getDepartmentsByFaculty,
  Department,
} from "@/services/admin.Service";

import OfficerForm from "@/components/OfficerForm";

import { useParams, useRouter } from "next/navigation";

export default function FacultyPage() {
  const params = useParams();
  const router = useRouter();

  const facultyId = Number(
    params.facultyId
  );

  const [departments, setDepartments] =
    useState<Department[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data =
        await getDepartmentsByFaculty(
          facultyId
        );

      setDepartments(data);
    };

    loadDepartments();
  }, [facultyId]);

  return (
    <div className="space-y-8 p-8">
      <button
        onClick={() =>
          router.push("/admin/faculties")
        }
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold">
        Faculty Management
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <OfficerForm
          title="Create Faculty AR"
          role="FACULTY_AR"
          facultyId={facultyId}
        />

        <OfficerForm
          title="Create Faculty MA"
          role="FACULTY_MA"
          facultyId={facultyId}
        />
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Departments
        </h2>

        <div className="grid gap-4">
          {departments.map((department) => (
            <button
              key={department.id}
              onClick={() =>
                router.push(
                  `/admin/faculties/${facultyId}/departments/${department.id}`
                )
              }
              className="rounded-xl border bg-white p-5 text-left shadow"
            >
              {department.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}