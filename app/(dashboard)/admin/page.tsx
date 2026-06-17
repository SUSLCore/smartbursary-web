"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage batches first, then move into the officer workflows for student services and faculties.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <button
          onClick={() => router.push("/admin/batches")}
          className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Setup first
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            Batches
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create, review, and remove academic batches.
          </p>
        </button>

        <button
          onClick={() => router.push("/admin/student-services")}
          className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Officers
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            Student Services
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Open the student service officer creation form.
          </p>
        </button>

        <button
          onClick={() => router.push("/admin/faculties")}
          className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Officers
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            Faculties
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage faculty officers and department setup.
          </p>
        </button>
      </div>
    </div>
  );
}
