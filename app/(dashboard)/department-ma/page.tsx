"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";

export default function DepartmentMaPage() {
	return (
		<AuthGuard>
			<DashboardView
				userType="Department MA"
				title="Department MA Dashboard"
				summary="Perform data entry, check initial document validity, and support the Department Head with bursary processes."
				stats={[
					{ label: "Applications pending entry", value: "15", description: "Bursary applications waiting for registration." },
					{ label: "Verified this week", value: "42", description: "Student profiles reviewed and forwarded." },
					{ label: "Flagged profiles", value: "4", description: "Applications with missing/incorrect details." },
				]}
				items={[
					"Enter student details and verify initial documents.",
					"Forward completed profiles to the Department Head.",
					"Assist students with application corrections and queries.",
				]}
			/>
		</AuthGuard>
	);
}
