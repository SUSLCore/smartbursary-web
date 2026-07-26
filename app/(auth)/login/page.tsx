"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthError } from "@/features/auth/authSlice";
import { loginUser } from "@/features/auth/authThunk";
import { AppDispatch, RootState } from "@/redux/store";

import Link from "next/link";

const ROLE_TO_DASHBOARD_PATH: Record<string, string> = {
  ADMIN: "/admin",
  STUDENT_SERVICE_SAR: "/student-service-sar",

  STUDENT: "/student",

  FACULTY_AR: "/faculty-ar",
  FACULTY_MA: "/faculty-ma",

  DEPARTMENT_HEAD: "/department-head",
  DEPARTMENT_MA: "/department-ma",
};

function getDashboardPath(role: string | null) {
  if (!role) return "/";
  return ROLE_TO_DASHBOARD_PATH[role.toUpperCase()] || "/";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { status, error, role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const resetMessage = searchParams.get("message");

  const isLoading = status === "loading";
  const formError = useMemo(
    () => localError || error || "",
    [error, localError],
  );

  useEffect(() => {
    if (isAuthenticated && role) {
      router.push(getDashboardPath(role));
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    dispatch(clearAuthError());

    if (!email || !password) {
      setLocalError("Please enter email and password.");
      return;
    }

    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      const userRole = response?.user?.role || response?.role;
      router.push(getDashboardPath(userRole));
    } catch {
      // Error handled by Redux
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9ebf2] px-4 py-10 sm:px-6">
      {/* Decorative background accents (hidden on small screens to avoid clutter) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -left-24 top-0 h-[120%] w-[40%] -rotate-3 bg-linear-to-br from-[#27b8d2] to-[#1a93a8]" />
        <div className="absolute left-0 top-0 h-full w-[28%] bg-[#27b8d2]/95" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-2 bg-linear-to-r from-[#27b8d2] via-[#17365d] to-[#27b8d2] sm:block lg:hidden" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-110 overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(23,54,93,0.25)] ring-1 ring-black/5">
        {/* Card top accent bar */}
        <div className="h-2 w-full bg-linear-to-r from-[#27b8d2] to-[#17365d]" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          {/* Logo + Title */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e9ebf2] ring-1 ring-[#27b8d2]/20">
              <Image
                src="/images/smartbursery-logo.png"
                alt="SmartBursery Logo"
                width={64}
                height={64}
                className="h-auto w-auto object-contain"
                priority
              />
            </div>

            <h1 className="text-[22px] font-extrabold leading-tight tracking-wide text-[#17365d] sm:text-[26px]">
              SUSL BURSARY
              <br />
              MANAGEMENT SYSTEM
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="w-full">
            {resetMessage ? (
              <p className="mb-5 flex items-start gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>{resetMessage}</span>
              </p>
            ) : null}

            <label className="mb-5 block">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Email Address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:border-[#27b8d2] focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[#27b8d2]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {formError ? (
              <p className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span>{formError}</span>
              </p>
            ) : (
              <div className="mb-5" />
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg shadow-[#27b8d2]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #27b8d2 0%, #1a93a8 100%)",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link
              href="/forgot_pwd"
              className="font-semibold text-[#27b8d2] transition hover:text-[#17365d] hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#27b8d2] transition hover:text-[#17365d] hover:underline"
            >
              Register
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka —
            Bursary Management System
          </p>
        </div>
      </div>
    </div>
  );
}
