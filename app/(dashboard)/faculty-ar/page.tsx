"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";

export default function FacultyArPage() {
	return (
		<AuthGuard>
			<DashboardView
				userType="Faculty AR"
				title="Faculty AR Dashboard"
				summary="Handle application reviews, monitor student submissions, and coordinate academic recommendations efficiently."
				items={[
					"Review eligibility documents for applicants.",
					"Add academic remarks before forwarding cases.",
					"Keep an eye on outstanding student requests.",
				]}
			/>
		</AuthGuard>
	);
}
