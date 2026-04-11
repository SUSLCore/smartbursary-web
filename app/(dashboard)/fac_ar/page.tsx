import DashboardView from "@/components/DashboardView";

export default function FacArPage() {
	return (
		<DashboardView
			userType="Faculty AR"
			title="Faculty AR dashboard"
			summary="Handle application reviews, monitor student submissions, and coordinate academic recommendations efficiently."
			stats={[
				{ label: "Reviews pending", value: "12", description: "Student submissions needing academic review." },
				{ label: "Assigned cases", value: "31", description: "Applications currently under your responsibility." },
				{ label: "Completed today", value: "7", description: "Cases processed during this session." },
			]}
			items={[
				"Review eligibility documents for applicants.",
				"Add academic remarks before forwarding cases.",
				"Keep an eye on outstanding student requests.",
			]}
		/>
	);
}