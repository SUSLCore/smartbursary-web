"use client";

import { useRouter } from "next/navigation";

import DepartmentCard from "@/components/DepartmentCard";
import { useDepartments } from "@/hooks/useDepartments";

export default function FacultyMADashboard() {
  const router = useRouter();

  const { departments, loading } =
    useDepartments();

  if (loading) {
    return (
      <div className="p-6">
        Loading Departments...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Departments
        </h1>

        <p className="text-gray-500 mt-2">
          Select a department to manage
          bursary documents.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onClick={() =>
              router.push(
                `/faculty-ma/departments/${department.id}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
}