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
    <div className="min-h-screen bg-[#e9ebf2]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Admin Control
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#17365d] sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Manage batches first, then move into the officer workflows for student services and faculties.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </div>
    </div>
  );
}
