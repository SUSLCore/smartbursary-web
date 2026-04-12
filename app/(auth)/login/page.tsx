"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthError } from "@/features/auth/authSlice";
import { loginUser } from "@/features/auth/authThunk";
import { AppDispatch, RootState } from "@/redux/store";

const ROLE_TO_DASHBOARD_PATH: Record<string, string> = {
  ADMIN: "/admin",
  STUDENT: "/student",
  SAR: "/sar",
  MA: "/ma",
  FAC_AR: "/fac_ar",
  FAC_MA: "/fac_ma",
  FACULTY_AR: "/fac_ar",
  FACULTY_MA: "/fac_ma",
};

function getDashboardPath(role: string | null) {
  if (!role) {
    return "/";
  }

  return ROLE_TO_DASHBOARD_PATH[role.toUpperCase()] ?? "/";
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const isLoading = status === "loading";
  const formError = useMemo(() => localError || error || "", [error, localError]);

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
      router.push(getDashboardPath(response.role || response.user.role));
    } catch {
      // Error is already handled by the slice.
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          SmartBursery
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your role in Redux state will decide the dashboard route after login.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              placeholder="binoj@student.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              placeholder="********"
            />
          </label>

          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-slate-900 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}