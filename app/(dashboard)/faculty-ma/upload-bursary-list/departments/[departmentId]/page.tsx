"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Batch, getBatches } from "@/services/batch.service";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError;
  return apiError?.response?.data?.message ?? fallback;
}

function toNumberParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return Number(value[0]);
  }

  return Number(value);
}

export default function FacultyMABatchDashboard() {
  const router = useRouter();
  const params = useParams<{ departmentId?: string | string[] }>();
  const departmentId = useMemo(
    () => toNumberParam(params.departmentId),
    [params.departmentId]
  );
  const departmentLabel = Number.isFinite(departmentId)
    ? departmentId
    : "Unknown";

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [eligibilityFile, setEligibilityFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sortedBatches = useMemo(
    () =>
      [...batches].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      ),
    [batches]
  );

  useEffect(() => {
    const loadBatches = async () => {
      try {
        setError("");
        const data = await getBatches();
        setBatches(data);

        if (data.length > 0) {
          setSelectedBatchId((current) => current || String(data[0].id));
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load batches"));
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  const selectedBatch = sortedBatches.find(
    (batch) => String(batch.id) === selectedBatchId
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedBatchId) {
      setError("Please select a batch");
      return;
    }

    if (!eligibilityFile) {
      setError("Please upload an eligibility list file");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage(
        `Prepared ${eligibilityFile.name} for batch ${selectedBatch?.name ?? selectedBatchId}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Yearly bursary workflow
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Batch select dashboard
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Department <span className="font-semibold text-slate-900">{departmentLabel}</span> is ready for batch selection and eligibility list upload.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/faculty-ma/upload-bursary-list")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to departments
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Select a batch
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                We load all batches here before submitting the eligibility list.
              </p>
            </div>
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Batch
            <select
              value={selectedBatchId}
              onChange={(event) => setSelectedBatchId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
              disabled={loading || sortedBatches.length === 0}
            >
              <option value="">
                {loading ? "Loading batches..." : "Select a batch"}
              </option>
              {sortedBatches.map((batch) => (
                <option key={batch.id} value={String(batch.id)}>
                  {batch.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Upload eligibility list
            <div className="mt-2 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-slate-400 hover:bg-slate-100">
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={(event) =>
                  setEligibilityFile(event.target.files?.[0] ?? null)
                }
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
              />

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Accepted formats: CSV, XLSX, XLS, or PDF.
              </p>
            </div>
          </label>

          {eligibilityFile && (
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              Selected file: <span className="font-semibold">{eligibilityFile.name}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Preparing..." : "Upload eligibility list"}
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
            Batch summary
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Current batch options fetched from the API.
          </p>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Loading batches...
            </div>
          ) : sortedBatches.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No batches found yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {sortedBatches.map((batch) => {
                const active = String(batch.id) === selectedBatchId;

                return (
                  <button
                    key={batch.id}
                    type="button"
                    onClick={() => setSelectedBatchId(String(batch.id))}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{batch.name}</span>
                      <span className="text-xs uppercase tracking-[0.2em] opacity-70">
                        ID {batch.id}
                      </span>
                    </div>
                    <p className={`mt-2 text-xs ${active ? "text-slate-200" : "text-slate-500"}`}>
                      Created {new Date(batch.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
