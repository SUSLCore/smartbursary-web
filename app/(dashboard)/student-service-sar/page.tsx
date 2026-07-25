"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";

export default function StudentServiceSarPage() {
	return (
		<AuthGuard>
			<DashboardView
				userType="Student Service SAR"
				title="Student Service SAR Dashboard"
				summary="Manage university-wide student bursary services, coordinate final reviews, and publish allocations."
				items={[
					"Perform final audits on recommended bursary allocations.",
					"Publish allocation decisions and notify awardees.",
					"Liaise with department and faculty officers for status reports.",
				]}
			/>
		</AuthGuard>
	);
}
