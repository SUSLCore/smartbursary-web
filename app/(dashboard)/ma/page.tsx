import DashboardView from "@/components/DashboardView";

export default function MaPage() {
	return (
		<DashboardView
			userType="MA"
			title="Management authority dashboard"
			summary="Oversee reviews, monitor progress, and make high-level decisions for the bursary process in one organized place."
			stats={[
				{ label: "Approval queue", value: "15", description: "Applications ready for management action." },
				{ label: "Escalations", value: "3", description: "Cases requiring immediate attention." },
				{ label: "Resolved", value: "28", description: "Applications cleared this month." },
			]}
			items={[
				"Review escalated bursary applications.",
				"Check workflow status and approval progress.",
				"Keep the decision pipeline moving smoothly.",
			]}
		/>
	);
}