"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthError } from "@/features/auth/authSlice";
import { loginUser } from "@/features/auth/authThunk";
import { AppDispatch, RootState } from "@/redux/store";

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
  const dispatch = useDispatch<AppDispatch>();

  const { status, error, role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
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
      const userRole = response?.user?.role || response?.role;
      router.push(getDashboardPath(userRole));
    } catch {
      // Error handled by Redux
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9ebf2] px-4">
      <div className="absolute left-0 top-0 h-full w-[31vw] min-w-[300px] bg-[#27b8d2]" />

      <div className="absolute left-[7vw] top-[10vh] h-[76vh] w-[37vw] min-w-[350px] rounded-l-[26px] bg-[#e9ebf2]" />

      <div className="relative z-10 -mt-16 flex w-full max-w-[820px] flex-col items-center">
        <div className="mb-16 flex items-center justify-center gap-3 -ml-10">
          <Image
            src="/images/smartbursery-logo.png"
            alt="SmartBursery Logo"
            width={130}
            height={130}
            className="h-auto w-auto object-contain"
            priority
          />

          <h1 className="text-center text-[28px] font-extrabold leading-[34px] tracking-wide text-[#17365d]">
            SUSL BURSARY
            
            MANAGEMENT SYSTEM
          </h1>
        </div>

        <form onSubmit={onSubmit} className="w-full max-w-[380px]">
          <label className="mb-5 block">
            <span className="mb-2 block text-[15px] font-semibold text-[#17365d]">
              Email Address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[54px] w-full rounded-xl border-2 border-[#20b8d4] bg-transparent px-5 text-[15px] outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-[#20b8d4]/30"
              placeholder="Enter your email"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block text-[15px] font-semibold text-[#17365d]">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-[54px] w-full rounded-xl border-2 border-[#20b8d4] bg-transparent px-5 text-[15px] outline-none transition placeholder:text-slate-500 focus:ring-2 focus:ring-[#20b8d4]/30"
              placeholder="Enter your password"
            />
          </label>

          {formError ? (
            <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="h-[54px] w-full rounded-xl bg-[#27b8d2] text-[16px] font-semibold text-white shadow-md transition-all hover:bg-[#1ca9c3] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}