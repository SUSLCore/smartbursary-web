import DashboardView from "@/components/DashboardView";

export default function StudentPage() {
	return (
		<DashboardView
			userType="Student"
			title="Student dashboard"
			summary="See your bursary journey at a glance, review your submission status, and follow the next steps clearly."
			stats={[
				{ label: "Application status", value: "In review", description: "Your current bursary request is being checked." },
				{ label: "Documents uploaded", value: "6", description: "Files currently attached to your profile." },
				{ label: "Next deadline", value: "Apr 18", description: "Upcoming date to keep in mind." },
			]}
			items={[
				"Track application progress from submission to approval.",
				"Upload or update required supporting documents.",
				"View the next action you need to take.",
			]}
		/>
	);
}