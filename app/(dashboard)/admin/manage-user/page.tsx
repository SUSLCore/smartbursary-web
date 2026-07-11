"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import ConfirmationCard from "@/components/ConfirmationCard";
import type { AuthUser } from "@/features/auth/authTypes";
import {
  deleteUserByRegisterId,
  getUserByRegisterId,
} from "@/services/admin.service";

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const candidate = error as {
    message?: unknown;
    error?: unknown;
    response?: { data?: { message?: unknown; error?: unknown } };
  };

  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message;
  }

  if (typeof candidate.error === "string" && candidate.error.trim()) {
    return candidate.error;
  }

  const responseMessage = candidate.response?.data?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  const responseError = candidate.response?.data?.error;
  if (typeof responseError === "string" && responseError.trim()) {
    return responseError;
  }

  return fallback;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3 19 6v5c0 4.4-3 8.1-7 10-4-1.9-7-5.6-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.9 1.9 3.5-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ManageUserPage() {
  const [registerId, setRegisterId] = useState("");
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const noticeClassName = (tone: NoticeTone) => {
    if (tone === "error") {
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    }

    if (tone === "success") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedRegisterId = registerId.trim();

    if (!trimmedRegisterId) {
      setNotice({
        tone: "error",
        text: "Please enter a registration ID before searching.",
      });
      setUser(null);
      return;
    }

    try {
      setSearching(true);
      setNotice(null);
      setUser(null);
      setConfirmDeleteOpen(false);

      const response = await getUserByRegisterId(trimmedRegisterId);

      setUser(response);
      setNotice({
        tone: "success",
        text: `User found for registration ID ${trimmedRegisterId}.`,
      });
    } catch (error: unknown) {
      setNotice({
        tone: "error",
        text: getErrorMessage(
          error,
          "Could not find a user for that registration ID."
        ),
      });
    } finally {
      setSearching(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) {
      return;
    }

    try {
      setDeleting(true);
      const response = await deleteUserByRegisterId(user.registerId);

      setNotice({
        tone: "success",
        text:
          response.message ??
          `User ${user.registerId} deleted successfully.`,
      });
      setUser(null);
      setConfirmDeleteOpen(false);
    } catch (error: unknown) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error, "Could not delete this user."),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#eef2f7] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto mb-5 flex w-full max-w-6xl justify-start">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
        >
          <ArrowLeftIcon />
          Back to admin panel
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="relative overflow-hidden rounded-[32px] bg-[#17365d] p-8 text-white shadow-[0_14px_35px_rgba(23,54,93,0.24)]">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#27b8d2]/20" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#27b8d2] ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-[#27b8d2]" />
              Admin Tools
            </span>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
              Manage user lookup
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              Search any user by registration ID and review the account details
              returned by the backend.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27b8d2]">
                  Lookup field
                </p>
                <p className="mt-2 text-lg font-bold">Registration ID</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27b8d2]">
                  Result type
                </p>
                <p className="mt-2 text-lg font-bold">User profile</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_35px_rgba(23,54,93,0.12)] ring-1 ring-slate-200">
          <div className="border-b border-slate-100 bg-white px-7 py-6 sm:px-9">
            <div className="mb-3 h-1 w-12 rounded-full bg-[#27b8d2]" />

            <h2 className="text-2xl font-extrabold text-[#17365d]">
              Search user by registration ID
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter a registration ID to look up the matching user account and
              review the details returned by the system.
            </p>
          </div>

          <div className="bg-[#f8fafc] p-6 sm:p-9">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(23,54,93,0.08)] ring-1 ring-slate-200 sm:p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Registration ID
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={registerId}
                      onChange={(event) => setRegisterId(event.target.value)}
                      placeholder="2021ICT001"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-2 focus:ring-[#27b8d2]/15"
                    />

                    <button
                      type="submit"
                      disabled={searching}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17365d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27b8d2] hover:text-[#17365d] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <SearchIcon />
                      {searching ? "Searching..." : "Search user"}
                    </button>
                  </div>
                </label>
              </form>

              {notice && (
                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm ${noticeClassName(
                    notice.tone
                  )}`}
                >
                  {notice.text}
                </div>
              )}

              {user && (
                <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-[#f8fafc]">
                  <div className="border-b border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#27b8d2]/10 text-[#27b8d2]">
                        <UserIcon />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#27b8d2]">
                          User profile
                        </p>
                        <h3 className="text-lg font-bold text-[#17365d]">
                          {user.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Register ID
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.registerId}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Role
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.role}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Email
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.email}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Phone
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.phone || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Account status
                      </p>
                      <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {user.isActive === false ? "Inactive" : "Active"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Internal ID
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.id}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Faculty ID
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.FacultyId ?? "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Department ID
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {user.DepartmentId ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 bg-white px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ShieldIcon />
                        <span>
                          The backend controls which fields are returned. If a
                          field is missing, we display a safe fallback.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteOpen(true)}
                        className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete user
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <ConfirmationCard
        open={confirmDeleteOpen}
        title="Delete this user?"
        description={`This will permanently delete the account for ${user?.name ?? "the selected user"} (${user?.registerId ?? registerId.trim()}). This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "OK, delete"}
        cancelText="Cancel"
        loading={deleting}
        destructive
        onCancel={() => {
          if (deleting) {
            return;
          }

          setConfirmDeleteOpen(false);
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
