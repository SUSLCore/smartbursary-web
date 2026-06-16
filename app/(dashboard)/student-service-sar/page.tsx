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
				stats={[
					{ label: "Pending allocations", value: "25", description: "Bursary applications ready for final allocation." },
					{ label: "Total active bursaries", value: "1,450", description: "Bursaries currently being distributed." },
					{ label: "Approved this month", value: "312", description: "Student accounts cleared for funding." },
				]}
				items={[
					"Perform final audits on recommended bursary allocations.",
					"Publish allocation decisions and notify awardees.",
					"Liaise with department and faculty officers for status reports.",
				]}
			/>
		</AuthGuard>
	);
}
