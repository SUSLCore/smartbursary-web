"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

type Faculty = {
  id: number;
  name: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await api.get("/api/faculties");
        setFaculties(data);
      } catch (error) {
        console.error("Failed to load faculties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (loading) {
    return <div className="p-6">Loading faculties...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Select a faculty</p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {faculties.map((faculty) => (
          <button
            key={faculty.id}
            onClick={() => router.push(`/admin/faculties/${faculty.id}`)}
            className="flex h-24 items-center justify-between rounded-xl border bg-white px-6 text-left shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
          >
            <span className="text-xl font-semibold text-gray-900">
              {faculty.name}
            </span>

            <span className="text-2xl text-gray-400">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}