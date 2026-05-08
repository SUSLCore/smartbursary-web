"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";

const officerRoles = [
  "STUDENT_SERVICE_SAR",
  "STUDENT_SERVICE_MA",
  "FACULTY_MA",
  "FACULTY_AR",
  "DEPARTMENT_HEAD",
];

export default function CreateOfficerPage() {
  const router = useRouter();
  const params = useParams();

  const facultyId = Number(params.facultyId);
  const departmentId = Number(params.departmentId);

  const [form, setForm] = useState({
    registerId: "",
    name: "",
    email: "",
    password: "",
    role: "STUDENT_SERVICE_SAR",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        facultyId,
        departmentId:
          form.role === "FACULTY_MA" || form.role === "FACULTY_AR"
            ? null
            : departmentId,
      };

      const result = await api.post("/api/officers", payload);

      setMessage(result.message || "Officer account created successfully");

      // reset form
      setForm({
        registerId: "",
        name: "",
        email: "",
        password: "",
        role: "STUDENT_SERVICE_SAR",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to create officer account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 rounded-lg bg-white px-4 py-2 text-sm shadow hover:bg-gray-100"
      >
        ← Back
      </button>

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Create Officer Account</h1>

        <p className="mt-2 text-gray-600 text-sm">
          Email will be used as username. A temporary password will be sent.
        </p>

        {/* Success Message */}
        {message && (
          <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="registerId"
            placeholder="Register ID (e.g. SAR007)"
            value={form.registerId}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="name"
            placeholder="Officer Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Officer Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            {officerRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 p-3 text-blue-600 font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border p-3 font-semibold hover:bg-gray-100"
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}