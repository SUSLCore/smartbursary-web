import Link from "next/link";
import MonthlyPendingRequestsPanel from "@/components/MonthlyPendingRequestsPanel";

const features = [
  {
    title: "Monthly document flow",
    description:
      "Upload the initial monthly document for your department, pick a batch and period, and continue the request workflow from one place.",
    href: "/faculty-ma/monthly-request-approval",
    accent: "from-[#17365d] to-[#1f4d7a]",
    meta: "Monthly upload workflow",
  },
  {
    title: "Upload bursary available list",
    description:
      "Manage the yearly bursary availability flow by department and separate batch. Start with a department, then choose the batch and upload the list.",
    href: "/faculty-ma/upload-bursary-list",
    accent: "from-[#27b8d2] to-[#1a8fa3]",
    meta: "Yearly by department and batch",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FacultyMADashboard() {
  return (
    <div className="min-h-screen bg-[#e9ebf2] px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Faculty Workflows
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#17365d] sm:text-4xl">
            Faculty MA Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Use the monthly request flow as the main workspace, then move into
            bursary availability when you need the annual list.
          </p>
        </div>

        <div className="mt-8">
          <MonthlyPendingRequestsPanel variant="featured" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-7 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#27b8d2]/40 hover:shadow-xl hover:shadow-[#27b8d2]/15 sm:p-8"
            >
              <div
                className={`absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${feature.accent} opacity-15 blur-3xl transition duration-300 group-hover:opacity-25`}
              />
              <div
                className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${feature.accent}`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-lg font-black text-white shadow-lg`}
                  >
                    {index + 1}
                  </div>
                  <span className="rounded-full bg-[#17365d]/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#17365d]">
                    Workflow
                  </span>
                </div>

                <p
                  className={`mt-6 bg-gradient-to-r ${feature.accent} bg-clip-text text-xs font-bold uppercase tracking-[0.22em] text-transparent`}
                >
                  {feature.meta}
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-[#17365d]">
                  {feature.title}
                </h2>
                <p className="mt-4 min-h-[72px] max-w-xl text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-[#17365d]">
                    Open workflow
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${feature.accent} text-white shadow-md transition group-hover:translate-x-1`}
                  >
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
