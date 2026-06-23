"use client";

import OfficerForm from "@/components/OfficerForm";
import { useParams } from "next/navigation";

export default function DepartmentPage() {
  const params = useParams();

  const departmentId = Number(params.departmentId);

  return (
    <div className="relative space-y-8 overflow-hidden rounded-[2rem] bg-[#edf1f8] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#27b8d2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#17365d]/10 blur-3xl" />

      <div className="relative rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#17365d]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
          Department management
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
          Department Management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Create and manage the officers responsible for this department.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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
