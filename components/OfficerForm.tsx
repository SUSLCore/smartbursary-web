"use client";

import { useState } from "react";
import {
  CreateOfficerPayload,
  createSAR,
  createFacultyAR,
  createFacultyMA,
  createDepartmentHead,
  createDepartmentMA,
} from "@/services/admin.service";

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

interface OfficerFormProps {
  title: string;
  role:
    | "STUDENT_SERVICE_SAR"
    | "FACULTY_AR"
    | "FACULTY_MA"
    | "DEPARTMENT_HEAD"
    | "DEPARTMENT_MA";
  facultyId?: number;
  departmentId?: number;
}

export default function OfficerForm({
  title,
  role,
  facultyId,
  departmentId,
}: OfficerFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateOfficerPayload>({
    registerId: "",
    name: "",
    email: "",
    password: "",
    role,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      let result;

      switch (role) {
        case "STUDENT_SERVICE_SAR":
          result = await createSAR(form);
          break;

        case "FACULTY_AR":
          result = await createFacultyAR(facultyId!, form);
          break;

        case "FACULTY_MA":
          result = await createFacultyMA(facultyId!, form);
          break;

        case "DEPARTMENT_HEAD":
          result = await createDepartmentHead(departmentId!, form);
          break;

        case "DEPARTMENT_MA":
          result = await createDepartmentMA(departmentId!, form);
          break;
      }

      setMessage(result?.message ?? "Officer account created successfully");

      setForm({
        registerId: "",
        name: "",
        email: "",
        password: "",
        role,
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
           
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#17365d]">
            {title}
          </h2>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="registerId"
          placeholder="Register ID"
          value={form.registerId}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/15"
          required
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/15"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/15"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/15"
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundImage: "linear-gradient(90deg, #17365d 0%, #27b8d2 100%)",
          }}
          className="inline-flex cursor-pointer w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17365d]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
