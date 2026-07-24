"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

import authService from "@/services/auth.service";
import Link from "next/link";

type Faculty = {
  id: number;
  name: string;
  code: string;
};

type Department = {
  id: number;
  name: string;
  facultyId: number;
};

const faculties: Faculty[] = [
  { id: 1, name: "Faculty of Computing", code: "FC" },
  { id: 2, name: "Faculty of Applied Sciences", code: "FAPS" },
  { id: 3, name: "Faculty of Social Sciences & Languages", code: "FSSL" },
  { id: 4, name: "Faculty of Geomatics", code: "FG" },
  { id: 5, name: "Faculty of Technology", code: "FT" },
  { id: 6, name: "Faculty of Management Studies", code: "FMS" },
  { id: 7, name: "Faculty of Medicine", code: "FM" },
  { id: 8, name: "Faculty of Agricultural Sciences", code: "FAS" },
];

const departments: Department[] = [
  { id: 1, name: "Agribusiness Management", facultyId: 1 },
  { id: 2, name: "Export Agriculture", facultyId: 1 },
  { id: 3, name: "Livestock Production", facultyId: 1 },
  { id: 4, name: "Food Science & Technology", facultyId: 1 },
  { id: 5, name: "Natural Resources", facultyId: 2 },
  { id: 6, name: "Physical Sciences & Technology", facultyId: 2 },
  { id: 7, name: "Computing & Information Systems", facultyId: 2 },
  { id: 8, name: "Sports Sciences & Physical Education", facultyId: 2 },
  { id: 9, name: "CPRSG", facultyId: 3 },
  { id: 10, name: "Surveying and Geodesy", facultyId: 3 },
  { id: 11, name: "Accountancy and Finance", facultyId: 4 },
  { id: 12, name: "Business Management", facultyId: 4 },
  { id: 13, name: "Marketing Management", facultyId: 4 },
  { id: 14, name: "Tourism Management", facultyId: 4 },
  { id: 15, name: "Economics and Statistics", facultyId: 5 },
  { id: 16, name: "English Language Teaching", facultyId: 5 },
  { id: 17, name: "Languages", facultyId: 5 },
  { id: 18, name: "Social Sciences", facultyId: 5 },
  { id: 19, name: "Biosystems Technology", facultyId: 7 },
  { id: 20, name: "Engineering Technology", facultyId: 7 },
  {
    id: 21,
    name: "Department of Computing & Information Systems",
    facultyId: 8,
  },
  { id: 22, name: "Department of Software Engineering", facultyId: 8 },
  { id: 23, name: "Department of Data Science", facultyId: 8 },
];

type FormState = {
  registerId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  facultyId: string;
  departmentId: string;
};

const initialForm: FormState = {
  registerId: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  facultyId: "",
  departmentId: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const availableDepartments = useMemo(() => {
    if (!form.facultyId) {
      return [];
    }

    const selectedFacultyId = Number(form.facultyId);
    return departments.filter(
      (department) => department.facultyId === selectedFacultyId,
    );
  }, [form.facultyId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.facultyId || !form.departmentId) {
      setError("Please select both faculty and department.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.registerStudent({
        registerId: form.registerId,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        facultyId: Number(form.facultyId),
        departmentId: Number(form.departmentId),
      });

      setMessage(response.message || "Student registered successfully.");
      setForm(initialForm);
    } catch (submitError: unknown) {
      if (
        typeof submitError === "object" &&
        submitError !== null &&
        "response" in submitError
      ) {
        const response = (
          submitError as {
            response?: { data?: { message?: string } };
          }
        ).response;

        setError(
          response?.data?.message ??
            "Registration failed. Please check your details and try again.",
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9ebf2] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -left-24 top-0 h-[120%] w-[40%] -rotate-3 bg-linear-to-br from-[#27b8d2] to-[#1a93a8]" />
        <div className="absolute left-0 top-0 h-full w-[28%] bg-[#27b8d2]/95" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-2 bg-linear-to-r from-[#27b8d2] via-[#17365d] to-[#27b8d2] sm:block lg:hidden" />

      <div className="relative z-10 w-full max-w-160 overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(23,54,93,0.25)] ring-1 ring-black/5">
        <div className="h-2 w-full bg-linear-to-r from-[#27b8d2] to-[#17365d]" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          {/* Logo + Title */}
          <div className="mb-9 flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e9ebf2] ring-1 ring-[#27b8d2]/20">
              <Image
                src="/images/smartbursery-logo.png"
                alt="SmartBursery Logo"
                width={64}
                height={64}
                className="h-auto w-auto object-contain"
                priority
              />
            </div>

            <h1 className="text-[22px] font-extrabold leading-tight tracking-wide text-[#17365d] sm:text-[26px]">
              CREATE STUDENT ACCOUNT
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Select faculty first, then choose a department and complete
              registration
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Register ID
              </span>
              <input
                required
                value={form.registerId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    registerId: event.target.value,
                  }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                placeholder="2021ICT001"
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Full name
              </span>
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                placeholder="Binoj Madhuranga"
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Email
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                placeholder="binoj@student.com"
                autoComplete="email"
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Phone number
              </span>
              <input
                required
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                placeholder="0771234567"
              />
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Password
              </span>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[#27b8d2]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <label className="block sm:col-span-1">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Faculty
              </span>
              <select
                required
                value={form.facultyId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    facultyId: event.target.value,
                    departmentId: "",
                  }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
              >
                <option value="">Select faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name} ({faculty.code})
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Department
              </span>
              <select
                required
                disabled={!form.facultyId}
                value={form.departmentId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    departmentId: event.target.value,
                  }))
                }
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {form.facultyId
                    ? "Select department"
                    : "Select faculty first"}
                </option>
                {availableDepartments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>

            {error ? (
              <p className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span>{error}</span>
              </p>
            ) : null}

            {message ? (
              <p className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:col-span-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 shrink-0"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{message}</span>
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg shadow-[#27b8d2]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #27b8d2 0%, #1a93a8 100%)",
              }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                "Register student"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#27b8d2] transition hover:text-[#17365d] hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka —
            Bursary Management System
          </p>
        </div>
      </div>
    </div>
  );
}
