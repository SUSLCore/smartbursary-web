import DashboardView from "@/components/DashboardView";

export default function AdminPage() {
	return (
		<DashboardView
			userType="Admin"
			title="Admin control center"
			summary="Monitor the platform, review approvals, and keep every bursary workflow on track from one place."
			stats={[
				{ label: "Pending reviews", value: "18", description: "Applications waiting for final review." },
				{ label: "Active users", value: "246", description: "Students and staff currently using the system." },
				{ label: "Open alerts", value: "4", description: "Items that need attention today." },
			]}
			items={[
				"Approve or reject scholarship requests.",
				"Track all user activity from a centralized dashboard.",
				"Manage system-wide notices and settings.",
			]}
		/>
	);
}