"use client";

import { useEffect, useState } from "react";
import { getDepartmentsByFaculty, Department } from "@/services/admin.service";
import OfficerForm from "@/components/OfficerForm";

import { useParams, useRouter } from "next/navigation";

export default function FacultyPage() {
  const params = useParams();
  const router = useRouter();

  const facultyId = Number(params.facultyId);

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartmentsByFaculty(facultyId);

      setDepartments(data);
    };

    loadDepartments();
  }, [facultyId]);

  return (
    <div className="relative space-y-8 overflow-hidden rounded-4xl bg-[#edf1f8] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#27b8d2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#17365d]/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Faculty management
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
            Faculty
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Manage faculty-level officers first, then continue into department
            setup.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/faculties")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#17365d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#27b8d2]/40 hover:shadow-md hover:shadow-[#27b8d2]/10"
        >
          <span aria-hidden="true">←</span>
          Back to faculties
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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

      <div className="relative rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#17365d]">
              Departments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Choose a department to manage heads and department MA accounts.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <button
              key={department.id}
              onClick={() =>
                router.push(
                  `/admin/faculties/${facultyId}/departments/${department.id}`,
                )
              }
              className="group cursor-pointer rounded-[1.25rem] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-lg hover:shadow-[#27b8d2]/10"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#17365d]/10 text-[#17365d] transition-colors duration-300 group-hover:bg-[#17365d] group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M3 3h8v8H3V3Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 3h8v8h-8V3Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 13h8v8H3v-8Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 13h8v8h-8v-8Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="mt-2 text-lg font-semibold text-[#17365d]">
                    {department.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Open department officer management.
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
