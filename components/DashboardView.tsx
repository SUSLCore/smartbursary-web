type Stat = {
	label: string;
	value: string;
	description: string;
};

type DashboardViewProps = {
	userType: string;
	title: string;
	summary: string;
	stats: Stat[];
	items: string[];
};

export default function DashboardView({
	userType,
	title,
	summary,
	stats,
	items,
}: DashboardViewProps) {
	return (
		<div className="space-y-6">
			<section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-3">
						<span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
							{userType} dashboard
						</span>
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							{title}
						</h1>
						<p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
							{summary}
						</p>
					</div>
					<div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
						Current role: <span className="font-semibold">{userType}</span>
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
					>
						<p className="text-sm font-medium text-slate-500">{stat.label}</p>
						<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							{stat.value}
						</p>
						<p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
					</div>
				))}
			</section>

			<section className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
					<h2 className="text-lg font-semibold text-slate-900">Dashboard highlights</h2>
					<ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
						{items.map((item) => (
							<li key={item} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3">
								<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-sm">
					<h2 className="text-lg font-semibold">Quick note</h2>
					<p className="mt-4 text-sm leading-6 text-slate-200">
						This dashboard is a starter view for the {userType.toLowerCase()} role. You can connect it to real data and actions later without changing the shared layout.
					</p>
					<div className="mt-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
						SmartBursery keeps the same navbar across every dashboard.
					</div>
				</div>
			</section>
		</div>
	);
}