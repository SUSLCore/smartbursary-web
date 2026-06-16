"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";

export default function DepartmentHeadPage() {
	return (
		<AuthGuard>
			<DashboardView
				userType="Department Head"
				title="Department Head Dashboard"
				summary="Oversee department-level bursary applications, make final recommendations, and assign review workloads."
				stats={[
					{ label: "Assigned reviews", value: "8", description: "Pending departmental approval and remarks." },
					{ label: "Reviewed today", value: "3", description: "Applications completed and sent to faculty level." },
					{ label: "Total department students", value: "120", description: "Registered students under this department." },
				]}
				items={[
					"Verify student information and departmental eligibility criteria.",
					"Approve and sign off on departmental recommendations.",
					"Collaborate with Department MA on data verification and workloads.",
				]}
			/>
		</AuthGuard>
	);
}
