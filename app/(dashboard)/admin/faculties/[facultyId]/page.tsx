"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

type Department = {
  id: number;
  name: string;
  facultyId: number;
};

export default function FacultyDepartmentsPage() {
  const params = useParams();
  const router = useRouter();

  const facultyId = params.facultyId as string;

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await api.get(
        `/api/faculties/${facultyId}/departments`
      );
      setDepartments(data);
    };

    loadDepartments();
  }, [facultyId]);

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 rounded border px-4 py-2"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold">Departments</h1>
      <p className="mt-2 text-gray-600">
        Select a department to create officers
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() =>
              router.push(
                `/admin/faculties/${facultyId}/departments/${department.id}/officers/create`
              )
            }
            className="rounded-xl border bg-white p-6 text-left shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{department.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}