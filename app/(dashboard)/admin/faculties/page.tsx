"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFaculties, type Faculty } from "@/services/admin.service";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError;
  return apiError?.response?.data?.message ?? fallback;
}

export default function FacultiesPage() {
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setError("");
        const data = await getFaculties();
        setFaculties(data);
      } catch (error: unknown) {
        setError(getErrorMessage(error, "Failed to load faculties"));
      } finally {
        setLoading(false);
      }
    };

    loadFaculties();
  }, []);

  return (
    <div className="relative space-y-8 overflow-hidden rounded-4xl bg-[#edf1f8] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#27b8d2]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#17365d]/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Faculty Control
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
            Faculties
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Choose a faculty to manage its officers and departments.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#17365d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#27b8d2]/40 hover:shadow-md hover:shadow-[#27b8d2]/10"
        >
          Back to admin
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 text-slate-600 shadow-sm backdrop-blur">
          Loading faculties...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {faculties.map((faculty) => (
            <button
              key={faculty.id}
              onClick={() => router.push(`/admin/faculties/${faculty.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/10"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#27b8d2] to-[#17365d] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#27b8d2]/10 text-[#17365d] transition-colors duration-300 group-hover:bg-[#27b8d2] group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <path
                      d="M4 20V8.5L12 4l8 4.5V20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 20v-4h3v4M13 20v-4h3v4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="mt-2 text-lg font-semibold text-[#17365d]">
                    {faculty.name}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    Open faculty management for officer and department setup.
                  </div>
                </div>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#17365d] opacity-70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                Open faculty details
                <span aria-hidden="true">→</span>
              </div>
            </button>
          ))}

          {!faculties.length && (
            <div className="rounded-3xl border border-white/70 bg-white/85 p-6 text-slate-600 shadow-sm backdrop-blur">
              No faculties found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
