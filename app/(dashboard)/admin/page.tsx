"use client";

import { useRouter } from "next/navigation";

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 16l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 14.2c2.4.3 4 2 4 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <rect x="4" y="3" width="11" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 9h5v12h-5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 7h2M7.5 11h2M7.5 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SearchUserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <circle
        cx="10"
        cy="10"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m14.2 14.2 4.8 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 7.5v5M7.5 10h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M7 3.5h6.5L18.5 8V20.5H7V3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.5V8H18.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12h5M9.5 15h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e9ebf2]">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#27b8d2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#17365d]/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27b8d2] via-[#17365d] to-[#27b8d2]" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
                Admin Control
              </span>
              <h1 className="mt-4 text-3xl font-bold text-[#17365d] sm:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Central command for setup, officer workflows, account lookups,
                and monthly document management.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl bg-[#17365d] px-4 py-4 text-white shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Area
                </p>
                <p className="mt-1 text-lg font-bold">5 modules</p>
              </div>
              <div className="rounded-2xl bg-[#27b8d2]/10 px-4 py-4 text-[#17365d] shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Focus
                </p>
                <p className="mt-1 text-lg font-bold">Admin operations</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 text-[#17365d] shadow-sm ring-1 ring-slate-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Routing
                </p>
                <p className="mt-1 text-lg font-bold">Fast access</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <button
            onClick={() => router.push("/admin/batches")}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#27b8d2]/10 text-[#27b8d2] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
              <LayersIcon />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Setup first
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#17365d]">
              Batches
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create, review, and remove academic batches.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#17365d] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open <ArrowIcon />
            </span>
          </button>

          <button
            onClick={() => router.push("/admin/student-services")}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#27b8d2]/10 text-[#27b8d2] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
              <UsersIcon />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Officers
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#17365d]">
              Student Services
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Open the student service officer creation form.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#17365d] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open <ArrowIcon />
            </span>
          </button>

          <button
            onClick={() => router.push("/admin/faculties")}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#27b8d2]/10 text-[#27b8d2] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
              <BuildingIcon />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Officers
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#17365d]">
              Faculties
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage faculty officers and department setup.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#17365d] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open <ArrowIcon />
            </span>
          </button>

          <button
            onClick={() => router.push("/admin/manage-user")}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#27b8d2]/10 text-[#27b8d2] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
              <SearchUserIcon />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Users
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#17365d]">
              Manage User
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Search a user quickly by registration ID and review their account details.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#17365d] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open <ArrowIcon />
            </span>
          </button>

          <button
            onClick={() => router.push("/admin/manage-documents")}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#27b8d2]/10 text-[#27b8d2] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
              <FileIcon />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
              Documents
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#17365d]">
              Manage Documents
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Review and delete monthly document records from the admin API.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#17365d] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open <ArrowIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
