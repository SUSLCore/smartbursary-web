import Link from "next/link";

const features = [
  {
    title: "Monthly request approve list",
    description:
      "Handle the monthly attendance-sheet request workflow for SAR and upload the approval list using the provided sample file format.",
    href: "/faculty-ma/monthly-request-approval",
    accent: "from-slate-900 to-slate-700",
    meta: "Monthly SAR request workflow",
  },
  {
    title: "Upload bursary available list",
    description:
      "Manage the yearly bursary availability flow by department and separate batch. Start with a department, then choose the batch and upload the list.",
    href: "/faculty-ma/upload-bursary-list",
    accent: "from-emerald-500 to-teal-500",
    meta: "Yearly by department and batch",
  },
];

export default function FacultyMADashboard() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="p-6 sm:p-8">
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Faculty MA dashboard
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose the workflow you need
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              The Faculty MA area now focuses on two core tasks: uploading the bursary available list by department and batch, and managing monthly approval requests for SAR.
            </p>
          </div>

          <div className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Quick glance
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Workflow 1
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Monthly SAR approval list
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Workflow 2
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Yearly bursary list upload
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`h-2 w-24 rounded-full bg-gradient-to-r ${feature.accent}`} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {feature.meta}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              {feature.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              Open workflow
              <span className="transition group-hover:translate-x-1">-&gt;</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
