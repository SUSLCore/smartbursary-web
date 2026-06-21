"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Batch,
  createBatch,
  deleteBatch,
  getBatches,
} from "@/services/batch.service";

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

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M11 5 5 12l6 7M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

  const loadBatches = async () => {
    try {
      setError("");
      const data = await getBatches();
      setBatches(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load batches"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreateBatch = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Batch name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await createBatch({
        name: trimmedName,
      });

      setMessage(response.message ?? "Batch created successfully");
      setName("");
      await loadBatches();
    } catch (error: unknown) {
      setError(
        getErrorMessage(error, "Failed to create batch")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBatch = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this batch?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await deleteBatch(id);
      setMessage(response.message ?? "Batch deleted successfully");
      await loadBatches();
    } catch (error: unknown) {
      setError(
        getErrorMessage(error, "Failed to delete batch")
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-[#e9ebf2] p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Setup First
          </span>
          <h1 className="mt-3 text-3xl font-bold text-[#17365d]">Batches</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create academic batches, review the active list, and remove batches when needed.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
        >
          <ArrowLeftIcon />
          Back to admin
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50">
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27b8d2] to-[#17365d]" />

          <h2 className="text-xl font-semibold text-[#17365d]">
            Create batch
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add a new batch name such as{" "}
            <span className="font-semibold text-[#27b8d2]">21/22</span>.
          </p>

          <form onSubmit={handleCreateBatch} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-[#17365d]">
              Batch name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="21/22"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:ring-2 focus:ring-[#27b8d2]/20"
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#27b8d2] px-4 py-3 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating..." : "Create batch"}
            </button>
          </form>

          {(message || error) && (
            <div
              className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
                error
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              {error || message}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50">
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#17365d] to-[#27b8d2]" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#17365d]">
                Batch list
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {sortedBatches.length} batch{sortedBatches.length === 1 ? "" : "es"} available.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#27b8d2]/30 bg-[#27b8d2]/5 px-4 py-6 text-sm text-[#17365d]/70">
              Loading batches...
            </div>
          ) : sortedBatches.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#27b8d2]/30 bg-[#27b8d2]/5 px-4 py-6 text-sm text-[#17365d]/70">
              No batches found. Create the first one using the form on the left.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="group rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#27b8d2]/40 hover:bg-white hover:shadow-md hover:shadow-[#27b8d2]/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-[#17365d]">
                        {batch.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ID: {batch.id}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBatch(batch.id)}
                      disabled={deletingId === batch.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <TrashIcon />
                      {deletingId === batch.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-1 border-t border-slate-200/70 pt-3 text-xs text-slate-500">
                    <p>Created: {new Date(batch.createdAt).toLocaleString()}</p>
                    <p>Updated: {new Date(batch.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}