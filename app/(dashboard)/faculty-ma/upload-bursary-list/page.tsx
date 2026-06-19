"use client";

import { useRouter } from "next/navigation";

import DepartmentCard from "@/components/DepartmentCard";
import { useDepartments } from "@/hooks/useDepartments";

export default function UploadBursaryListPage() {
  const router = useRouter();
  const { departments, loading } = useDepartments();

  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Loading departments...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Yearly bursary workflow
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Upload bursary available list
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Choose a department first. After that, select the correct batch and upload the yearly eligibility list for that department.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/faculty-ma")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to dashboard
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Department list
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Pick the department that needs a bursary list upload.
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No departments found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() =>
                  router.push(
                    `/faculty-ma/upload-bursary-list/departments/${department.id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
