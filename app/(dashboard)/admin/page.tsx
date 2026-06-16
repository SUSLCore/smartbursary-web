"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <button
          onClick={() =>
            router.push("/admin/student-services")
          }
          className="rounded-xl border bg-white p-8 text-left shadow"
        >
          <h2 className="text-xl font-semibold">
            Student Services
          </h2>
        </button>

        <button
          onClick={() =>
            router.push("/admin/faculties")
          }
          className="rounded-xl border bg-white p-8 text-left shadow"
        >
          <h2 className="text-xl font-semibold">
            Faculties
          </h2>
        </button>
      </div>
    </div>
  );
}