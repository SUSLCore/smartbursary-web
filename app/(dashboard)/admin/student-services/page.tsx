"use client";

import OfficerForm from "@/components/OfficerForm";

export default function StudentServicesPage() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Student Services Branch
      </h1>

      <OfficerForm
        title="Create Student Service SAR"
        role="STUDENT_SERVICE_SAR"
      />
    </div>
  );
}