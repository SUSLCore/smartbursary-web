"use client";

import OfficerForm from "@/components/OfficerForm";
import { useParams, useRouter } from "next/navigation";

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();

  const facultyId = Number(params.facultyId);
  const departmentId = Number(params.departmentId);

  return (
    <div className="relative space-y-8 overflow-hidden rounded-4xl bg-[#edf1f8] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#27b8d2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#17365d]/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="max-w-2xl">
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

        <button
          onClick={() => router.push(`/admin/faculties/${facultyId}`)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#17365d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#27b8d2]/40 hover:shadow-md hover:shadow-[#27b8d2]/10"
        >
          <span aria-hidden="true">←</span>
          Back to faculty
        </button>
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
