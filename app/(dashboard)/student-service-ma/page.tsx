"use client";

import AuthGuard from "@/components/AuthGuard";

export default function StudentServiceMaPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Service MA Dashboard</h1>
        <p className="mt-2 text-slate-600">Placeholder page for STUDENT_SERVICE_MA role.</p>
      </div>
    </AuthGuard>
  );
}
