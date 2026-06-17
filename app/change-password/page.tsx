"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

export default function ChangePasswordPage() {
    const router = useRouter();
    const user = useSelector(
        (state: RootState) =>
            state.auth.user
    );

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ROLE_TO_DASHBOARD_PATH: Record<string, string> = {
        ADMIN: "/admin",
        STUDENT_SERVICE_SAR: "/student-service-sar",
        FACULTY_AR: "/faculty-ar",
        FACULTY_MA: "/faculty-ma",
        DEPARTMENT_HEAD: "/department-head",
        DEPARTMENT_MA: "/department-ma",
        STUDENT: "/student",
    };

    function getDashboardPath(role: string | null) {
        if (!role) return "/";
        return ROLE_TO_DASHBOARD_PATH[role.toUpperCase()] ?? "/";
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/api/auth/change-password", {
                currentPassword,
                newPassword,
            });

            const data = res.data ?? {};
            if (data.success === false) {
                setError(data.message || "Failed to change password");
                setLoading(false);
                return;
            }

            const role = user?.role ?? null;
            router.push(getDashboardPath(role));
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Failed to change password"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <h1 className="text-2xl font-bold">Change Password</h1>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">Current password</span>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">New password</span>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">Confirm password</span>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
                        />
                    </label>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Updating..." : "Change password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
