"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import authService from "@/services/auth.service";

const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function Spinner() {
	return (
		<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
		</svg>
	);
}

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
		mode: "onSubmit",
	});

	const onSubmit = async (values: ForgotPasswordFormValues) => {
		setIsSubmitting(true);
		try {
			const response = await authService.forgotPassword(values.email);
			if (response.success) {
				toast.success(response.message || "OTP has been sent successfully.");
				router.push(`/forgot_pwd/verify-otp?email=${encodeURIComponent(values.email)}`);
				return;
			}

			toast.error(response.message || "Unable to send OTP. Please try again.");
		} catch (error: unknown) {
			const message = isAxiosError<{ success?: boolean; message?: string }>(error)
				? error.response?.data?.message ?? "Internal Server Error"
				: "Internal Server Error";

			toast.error(message);
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
							FORGOT PASSWORD
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Enter your registered email address to receive a One-Time Password (OTP).
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<label className="mb-5 block">
									<span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
										Email Address
									</span>
									<input
										{...field}
										type="email"
										placeholder="student@smartbursary.com"
										autoComplete="email"
										aria-invalid={errors.email ? "true" : "false"}
										className={`h-13 w-full rounded-2xl border bg-slate-50 px-4 text-[15px] text-[#17365d] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10 ${errors.email ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#27b8d2]"}`}
									/>
									{errors.email ? (
										<p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
									) : null}
								</label>
							)}
						/>

						<button
							type="submit"
							disabled={isSubmitting}
							className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg shadow-[#27b8d2]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
							style={{ backgroundImage: "linear-gradient(90deg, #27b8d2 0%, #1a93a8 100%)" }}
						>
							{isSubmitting ? (
								<>
									<Spinner />
									Sending OTP...
								</>
							) : (
								"Send OTP"
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

					<p className="mt-8 text-center text-xs text-slate-400">
						© {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka — Bursary Management System
					</p>
				</div>
			</div>
		</div>
	);
}