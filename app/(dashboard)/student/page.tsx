"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import { userService, type UserProfile } from "@/services/user.service";

type NoticeState = {
  tone: "success" | "error" | "info";
  text: string;
} | null;

const emptyNotice: NoticeState = null;

const profileItems = (profile: UserProfile) => [
  { label: "Student ID", value: profile.registerId },
  { label: "Full name", value: profile.name },
  { label: "Email", value: profile.email },
  { label: "Phone", value: profile.phone || "-" },
  { label: "Role", value: profile.role },
  { label: "Status", value: profile.isActive ? "Active" : "Inactive" },
  { label: "Faculty", value: profile.Faculty?.name ?? "-" },
  { label: "Department", value: profile.Department?.name ?? "-" },
  { label: "Eligibility records", value: String(profile.eligibilityRecords?.length ?? 0) },
];

export default function StudentPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(emptyNotice);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setNotice(emptyNotice);

        const response = await userService.getProfile();

        if (!active) {
          return;
        }

        setProfile(response.data);
        setNotice({
          tone: "success",
          text: "Student profile loaded successfully.",
        });
      } catch (error) {
        console.error(error);

        if (!active) {
          return;
        }

        const err = error as { message?: string };
        setProfile(null);
        setNotice({
          tone: "error",
          text: err.message ?? "Could not load the student profile right now.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthGuard>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Student dashboard
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your bursary profile
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Review your core student details, department placement, and bursary eligibility status in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Eligibility
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {loading ? "Loading..." : profile?.isEligible ? "Eligible" : "Not eligible"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Account
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {loading ? "Loading..." : profile?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
              notice.tone === "success"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : notice.tone === "error"
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : "bg-slate-50 text-slate-700 ring-slate-200"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="space-y-4">
              <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : profile ? (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Essential profile details
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The information below comes directly from your profile API.
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    profile.isEligible
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {profile.isEligible ? "Eligible" : "Not eligible"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {profileItems(profile).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900 break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Eligibility status
                </h2>
                <div
                  className={`mt-4 rounded-2xl border px-4 py-5 ${
                    profile.isEligible
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-rose-200 bg-rose-50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                      profile.isEligible ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {profile.isEligible ? "Eligible" : "Not eligible"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {profile.isEligible
                      ? "You currently meet the bursary eligibility requirements."
                      : "You currently do not meet the bursary eligibility requirements."}
                  </p>
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick facts
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    Faculty: <span className="font-semibold text-slate-900">{profile.Faculty?.name ?? "-"}</span>
                  </li>
                  <li className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    Department: <span className="font-semibold text-slate-900">{profile.Department?.name ?? "-"}</span>
                  </li>
                  <li className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    Password change required:{" "}
                    <span className="font-semibold text-slate-900">
                      {profile.mustChangePassword ? "Yes" : "No"}
                    </span>
                  </li>
                  <li className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    Eligibility records:{" "}
                    <span className="font-semibold text-slate-900">
                      {profile.eligibilityRecords?.length ?? 0}
                    </span>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        ) : (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">
              No profile data is available right now.
            </p>
          </section>
        )}
      </div>
    </AuthGuard>
  );
}
