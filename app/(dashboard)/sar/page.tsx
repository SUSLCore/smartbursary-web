import DashboardView from "@/components/DashboardView";

export default function SarPage() {
	return (
		<DashboardView
			userType="SAR"
			title="SAR dashboard"
			summary="Track student applications, monitor routing, and keep the review process moving with a clean operational view."
			stats={[
				{ label: "New entries", value: "24", description: "Applications received and ready for routing." },
				{ label: "Needs action", value: "8", description: "Records waiting for your next step." },
				{ label: "Processed", value: "19", description: "Items moved forward today." },
			]}
			items={[
				"Route applications to the correct reviewers.",
				"Monitor workflow status from a single screen.",
				"Keep the application pipeline organized.",
			]}
		/>
 	);
}