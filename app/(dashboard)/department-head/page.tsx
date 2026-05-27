"use client";

import React, { ReactNode } from "react";

// Local fallback AuthGuard to avoid import resolution issues.
// Replace with the real AuthGuard import when available.
function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function DepartmentHeadPage() {
  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Department Head Dashboard</h1>
        <p className="mt-2 text-slate-600">Placeholder page for DEPARTMENT_HEAD role.</p>
      </div>
    </AuthGuard>
  );
}
