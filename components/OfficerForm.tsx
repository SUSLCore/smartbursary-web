"use client";

import { useState } from "react";
import {
  CreateOfficerPayload,
  createSAR,
  createFacultyAR,
  createFacultyMA,
  createDepartmentHead,
  createDepartmentMA,
} from "@/services/admin.Service";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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
          result = await createFacultyAR(
            facultyId!,
            form
          );
          break;

        case "FACULTY_MA":
          result = await createFacultyMA(
            facultyId!,
            form
          );
          break;

        case "DEPARTMENT_HEAD":
          result = await createDepartmentHead(
            departmentId!,
            form
          );
          break;

        case "DEPARTMENT_MA":
          result = await createDepartmentMA(
            departmentId!,
            form
          );
          break;
      }

      setMessage(
        result?.message ??
          "Officer account created successfully"
      );

      setForm({
        registerId: "",
        name: "",
        email: "",
        password: "",
        role,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        {title}
      </h2>

      {message && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="registerId"
          placeholder="Register ID"
          value={form.registerId}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}