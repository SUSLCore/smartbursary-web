"use client";

import { useState } from "react";
import Link from "next/link";

export default function MonthlyRequestApprovalPage() {
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sampleFile) {
      setError("Please upload the monthly approval file");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage(`Prepared ${sampleFile.name} for SAR review`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Monthly SAR workflow
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Request month approve list
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Upload the monthly approval list that will be shared with SAR for attendance sheet processing and review.
            </p>
          </div>

          <Link
            href="/faculty-ma"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Upload monthly approval file
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the sample template to format the approval list before upload.
          </p>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Sample file
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Download the sample CSV and update it with the monthly approve list before uploading.
            </p>
            <a
              href="/faculty-ma-monthly-request-sample.csv"
              download
              className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Download sample file
            </a>
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Upload monthly approve list
            <div className="mt-2 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-slate-400 hover:bg-slate-100">
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={(event) => {
                  setSampleFile(event.target.files?.[0] ?? null);
                  setMessage("");
                  setError("");
                }}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
              />
            </div>
          </label>

          {sampleFile && (
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              Selected file: <span className="font-semibold">{sampleFile.name}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Preparing..." : "Submit monthly approval list"}
          </button>

          {(message || error) && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                error
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              {error || message}
            </div>
          )}
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Workflow notes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Keep one file per month for cleaner SAR review.
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Use the sample file headers before uploading the final list.
            </li>
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              The attendance sheet request should match the correct month and department.
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
