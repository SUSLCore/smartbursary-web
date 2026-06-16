"use client";

import OfficerForm from "@/components/OfficerForm";
import { useParams } from "next/navigation";

export default function DepartmentPage() {
  const params = useParams();

  const departmentId = Number(
    params.departmentId
  );

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Department Management
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <OfficerForm
          title="Create Department Head"
          role="DEPARTMENT_HEAD"
          departmentId={departmentId}
        />

        <OfficerForm
          title="Create Department MA"
          role="DEPARTMENT_MA"
          departmentId={departmentId}
        />
      </div>
    </div>
  );
}