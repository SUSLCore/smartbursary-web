"use client";

import Image from "next/image";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import authService from "@/services/auth.service";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Password is required.")
			.regex(
				passwordRegex,
				"Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
			),
		confirmPassword: z.string().min(1, "Confirm Password is required."),
	})
	.refine((values) => values.password === values.confirmPassword, {
		path: ["confirmPassword"],
		message: "Confirm Password must match Password.",
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function Spinner() {
	return (
		<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
		</svg>
	);
}

function EyeIcon({ open }: { open: boolean }) {
	if (open) {
		return (
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
		);
	}

	return (
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
	);
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onSubmit",
	});

	const onSubmit = async (values: ResetPasswordFormValues) => {
		setIsSubmitting(true);
		try {
			const response = await authService.resetPassword(values.password, values.confirmPassword);
			if (response.success) {
				const successMessage = response.message || "Password changed successfully. Please login again.";
				toast.success(successMessage);
				router.push(`/login?message=${encodeURIComponent(successMessage)}`);
				return;
			}

			toast.error(response.message || "Unable to reset password. Please try again.");
		} catch (error: unknown) {
			const status = isAxiosError(error) ? error.response?.status : undefined;
			const message = isAxiosError<{ success?: boolean; message?: string }>(error)
				? error.response?.data?.message ?? "Internal Server Error"
				: "Internal Server Error";

			toast.error(message);

			if (status === 401) {
				router.push("/forgot_pwd");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#e9ebf2] px-4 py-10 sm:px-6">
			<div className="pointer-events-none absolute inset-0 hidden lg:block">
				<div className="absolute -left-24 top-0 h-[120%] w-[40%] -rotate-3 bg-linear-to-br from-[#27b8d2] to-[#1a93a8]" />
				<div className="absolute left-0 top-0 h-full w-[28%] bg-[#27b8d2]/95" />
			</div>
			<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-2 bg-linear-to-r from-[#27b8d2] via-[#17365d] to-[#27b8d2] sm:block lg:hidden" />

			<div className="relative z-10 w-full max-w-110 overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(23,54,93,0.25)] ring-1 ring-black/5">
				<div className="h-2 w-full bg-linear-to-r from-[#27b8d2] to-[#17365d]" />

				<div className="px-6 py-10 sm:px-10 sm:py-12">
					<div className="mb-9 flex flex-col items-center text-center">
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
							RESET PASSWORD
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Create a new password for your SmartBursary account.
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
						<label className="mb-5 block">
							<span className="mb-2 block text-[14px] font-semibold text-[#17365d]">New Password</span>
							<div className="relative">
								<input
									{...register("password")}
									type={showPassword ? "text" : "password"}
									placeholder="NewPassword@123"
									autoComplete="new-password"
									aria-invalid={errors.password ? "true" : "false"}
									disabled={isSubmitting}
									className={`h-13 w-full rounded-2xl border bg-slate-50 px-4 pr-12 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:opacity-70 ${errors.password ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#27b8d2]"}`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[#27b8d2] disabled:cursor-not-allowed"
									aria-label={showPassword ? "Hide password" : "Show password"}
									disabled={isSubmitting}
								>
									<EyeIcon open={showPassword} />
								</button>
							</div>
							{errors.password ? (
								<p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
							) : null}
						</label>

						<label className="mb-5 block">
							<span className="mb-2 block text-[14px] font-semibold text-[#17365d]">Confirm Password</span>
							<div className="relative">
								<input
									{...register("confirmPassword")}
									type={showConfirmPassword ? "text" : "password"}
									placeholder="NewPassword@123"
									autoComplete="new-password"
									aria-invalid={errors.confirmPassword ? "true" : "false"}
									disabled={isSubmitting}
									className={`h-13 w-full rounded-2xl border bg-slate-50 px-4 pr-12 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:opacity-70 ${errors.confirmPassword ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#27b8d2]"}`}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((prev) => !prev)}
									className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[#27b8d2] disabled:cursor-not-allowed"
									aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
									disabled={isSubmitting}
								>
									<EyeIcon open={showConfirmPassword} />
								</button>
							</div>
							{errors.confirmPassword ? (
								<p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
							) : null}
						</label>

						<button
							type="submit"
							disabled={isSubmitting}
							className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg shadow-[#27b8d2]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
							style={{ backgroundImage: "linear-gradient(90deg, #27b8d2 0%, #1a93a8 100%)" }}
						>
							{isSubmitting ? (
								<>
									<Spinner />
									Resetting Password...
								</>
							) : (
								"Reset Password"
							)}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-slate-500">
						Back to{" "}
						<Link
							href="/login"
							className="font-semibold text-[#27b8d2] transition hover:text-[#17365d] hover:underline"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
