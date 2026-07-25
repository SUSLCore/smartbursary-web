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
				items={[
					"Verify student information and departmental eligibility criteria.",
					"Approve and sign off on departmental recommendations.",
					"Collaborate with Department MA on data verification and workloads.",
				]}
			/>
		</AuthGuard>
	);
}
