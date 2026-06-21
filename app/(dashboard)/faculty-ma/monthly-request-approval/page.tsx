"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useDepartments } from "@/hooks/useDepartments";

export default function MonthlyRequestApprovalPage() {
  const { departments, loading } = useDepartments();
  const [departmentSearch, setDepartmentSearch] = useState("");

  const filteredDepartments = useMemo(() => {
    const query = departmentSearch.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) => {
      const name = department.name.toLowerCase();
      const code = department.code?.toLowerCase() ?? "";

      return name.includes(query) || code.includes(query);
    });
  }, [departmentSearch, departments]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="p-6 sm:p-8">
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Monthly SAR workflow
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Monthly request approve list
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              This section now shows the available departments from the API with a simple dummy preview for monthly approvals.
            </p>
          </div>

          <div className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Quick glance
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  State
                </p>
                <p className="mt-2 text-lg font-semibold">Dummy UI preview</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Source
                </p>
                <p className="mt-2 text-lg font-semibold">Departments API</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Available departments
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                These are loaded from the API and shown as a simple monthly workflow preview.
              </p>
            </div>

            <label className="block w-full sm:max-w-xs text-sm font-medium text-slate-700">
              Search department
              <input
                type="search"
                value={departmentSearch}
                onChange={(event) => setDepartmentSearch(event.target.value)}
                placeholder="Search by name or code"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              {departmentSearch.trim()
                ? "No departments match your search."
                : "No departments found."}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredDepartments.map((department) => (
                <div
                  key={department.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {department.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {department.code ?? "No department code"}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
                    Monthly dummy preview
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Monthly dummy panel
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep this light until the monthly workflow API is connected.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Display
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Department list only
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Action
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Placeholder monthly approval UI
                </p>
              </div>
            </div>
          </section>

          <Link
            href="/faculty-ma"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
        </aside>
      </section>
    </div>
  );
}
