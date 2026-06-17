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
    <div className="space-y-8 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create academic batches, review the active list, and remove batches when needed.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
        >
          Back to admin
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Create batch
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add a new batch name such as <span className="font-medium">21/22</span>.
          </p>

          <form onSubmit={handleCreateBatch} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Batch name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="21/22"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Batch list
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {sortedBatches.length} batch{sortedBatches.length === 1 ? "" : "es"} available.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Loading batches...
            </div>
          ) : sortedBatches.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No batches found. Create the first one using the form on the left.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
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
                      className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingId === batch.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-1 text-xs text-slate-500">
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
