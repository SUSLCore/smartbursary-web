"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";

export default function FacultyMaPage() {
	return (
		<AuthGuard>
			<DashboardView
				userType="Faculty MA"
				title="Faculty MA Dashboard"
				summary="View assigned applications, validate supporting documents, and support bursary decision-making from a focused workspace."
				stats={[
					{ label: "Items to verify", value: "9", description: "Records awaiting your confirmation." },
					{ label: "In progress", value: "21", description: "Applications currently moving through the workflow." },
					{ label: "Completed", value: "14", description: "Tasks finished this week." },
				]}
				items={[
					"Validate attached records and comments.",
					"Coordinate updates with other faculty reviewers.",
					"Maintain a simple view of your active workload.",
				]}
			/>
		</AuthGuard>
	);
}
