"use client";

import OfficerForm from "@/components/OfficerForm";

export default function StudentServicesPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#eef2f7] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="relative overflow-hidden rounded-[32px] bg-[#17365d] p-8 text-white shadow-[0_14px_35px_rgba(23,54,93,0.24)]">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#27b8d2]/20" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#27b8d2] ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-[#27b8d2]" />
              Officers
            </span>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
              Student Services Branch
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              Create official Student Service officer accounts and assign access
              for bursary management workflows.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27b8d2]">
                  Role
                </p>
                <p className="mt-2 text-lg font-bold">Student Service SAR</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27b8d2]">
                  Access
                </p>
                <p className="mt-2 text-lg font-bold">Branch Officer Portal</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_35px_rgba(23,54,93,0.12)] ring-1 ring-slate-200">
          <div className="border-b border-slate-100 bg-white px-7 py-6 sm:px-9">
            <div className="mb-3 h-1 w-12 rounded-full bg-[#27b8d2]" />

            <h2 className="text-2xl font-extrabold text-[#17365d]">
              Create Officer Account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fill in the officer details below. Login credentials will be used
              for role-based dashboard access.
            </p>
          </div>

          <div className="bg-[#f8fafc] p-6 sm:p-9">
            <div
              className="
                rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(23,54,93,0.08)]
                ring-1 ring-slate-200 sm:p-8

                [&_form]:rounded-[24px]
                [&_form]:border-0
                [&_form]:bg-white
                [&_form]:shadow-none
                [&_form]:ring-1
                [&_form]:ring-slate-200

                [&_h2]:text-[#17365d]
                [&_h3]:text-[#17365d]

                [&_input]:border-0
                [&_input]:bg-[#f1f5f9]
                [&_input]:text-[#17365d]
                [&_input]:ring-1
                [&_input]:ring-slate-200
                [&_input]:outline-none
                [&_input]:transition
                [&_input]:placeholder:text-slate-400
                focus:[&_input]:bg-white
                focus:[&_input]:ring-2
                focus:[&_input]:ring-[#27b8d2]

                [&_button]:border-0
                [&_button]:bg-[#17365d]
                [&_button]:text-white
                [&_button]:shadow-md
                [&_button]:shadow-[#17365d]/20
                hover:[&_button]:bg-[#27b8d2]
                hover:[&_button]:text-[#17365d]
              "
            >
              <OfficerForm
                title="Create Student Service SAR"
                role="STUDENT_SERVICE_SAR"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}