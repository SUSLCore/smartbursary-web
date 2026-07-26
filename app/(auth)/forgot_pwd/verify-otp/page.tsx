"use client";

import Image from "next/image";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import authService from "@/services/auth.service";

const OTP_LENGTH = 6;
const otpRegex = /^\d{6}$/;

const verifyOtpSchema = z.object({
	email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
	otp: z
		.string()
		.min(1, "OTP is required.")
		.regex(otpRegex, "OTP must contain exactly 6 numeric digits."),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

function Spinner() {
	return (
		<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
		</svg>
	);
}

export default function VerifyOtpPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryEmail = searchParams.get("email") ?? "";
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
	const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<VerifyOtpFormValues>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			email: queryEmail,
			otp: "",
		},
		mode: "onSubmit",
	});

	useEffect(() => {
		setValue("email", queryEmail, { shouldDirty: false, shouldValidate: false });
	}, [queryEmail, setValue]);

	useEffect(() => {
		setValue("otp", otpDigits.join(""), { shouldDirty: true, shouldValidate: false });
	}, [otpDigits, setValue]);

	const handleDigitChange = (index: number, rawValue: string) => {
		const numeric = rawValue.replace(/\D/g, "");
		setOtpDigits((previous) => {
			const next = [...previous];
			next[index] = numeric ? numeric[numeric.length - 1] : "";
			return next;
		});

		if (numeric && index < OTP_LENGTH - 1) {
			otpRefs.current[index + 1]?.focus();
		}
	};

	const handleDigitKeyDown = (index: number, key: string) => {
		if (key === "Backspace") {
			if (otpDigits[index]) {
				setOtpDigits((previous) => {
					const next = [...previous];
					next[index] = "";
					return next;
				});
				return;
			}

			if (index > 0) {
				otpRefs.current[index - 1]?.focus();
				setOtpDigits((previous) => {
					const next = [...previous];
					next[index - 1] = "";
					return next;
				});
			}
		}

		if (key === "ArrowLeft" && index > 0) {
			otpRefs.current[index - 1]?.focus();
		}

		if (key === "ArrowRight" && index < OTP_LENGTH - 1) {
			otpRefs.current[index + 1]?.focus();
		}
	};

	const handleDigitPaste = (index: number, pastedText: string) => {
		const numeric = pastedText.replace(/\D/g, "").slice(0, OTP_LENGTH - index);
		if (!numeric) {
			return;
		}

		setOtpDigits((previous) => {
			const next = [...previous];
			for (let offset = 0; offset < numeric.length; offset += 1) {
				next[index + offset] = numeric[offset];
			}
			return next;
		});

		const focusIndex = Math.min(index + numeric.length, OTP_LENGTH - 1);
		otpRefs.current[focusIndex]?.focus();
	};

	const onSubmit = async (values: VerifyOtpFormValues) => {
		setIsSubmitting(true);
		try {
			const response = await authService.verifyOtp({
				email: values.email,
				otp: values.otp,
			});

			if (response.success) {
				toast.success(response.message || "OTP verified successfully.");
				router.push("/forgot_pwd/reset-password");
				return;
			}

			toast.error(response.message || "Unable to verify OTP. Please try again.");
		} catch (error: unknown) {
			const message = isAxiosError<{ success?: boolean; message?: string }>(error)
				? error.response?.data?.message ?? "You have entered an incorrect OTP. Unable to verify OTP!"
				: "You have entered an incorrect OTP. Unable to verify OTP!";
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
					<div className="mb-8 flex flex-col items-center text-center">
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
							VERIFY OTP
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Enter the 6-digit One-Time Password (OTP) sent to your registered email address.
						</p>
						<p className="mt-4 text-sm text-slate-500">
							OTP sent to:
							<br />
							<span className="font-semibold text-[#17365d]">
								{queryEmail || "Email address not found in URL."}
							</span>
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
						<input type="hidden" {...register("email")} />
						<input type="hidden" {...register("otp")} />
						{errors.email ? (
							<p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{errors.email.message}
							</p>
						) : null}

						<div className="mb-5">
							<span className="mb-2 block text-[14px] font-semibold text-[#17365d]">
								One-Time Password (OTP)
							</span>
							<div className="grid grid-cols-6 gap-2 sm:gap-3">
								{otpDigits.map((digit, index) => (
									<input
										key={index}
										ref={(element) => {
											otpRefs.current[index] = element;
										}}
										type="text"
										inputMode="numeric"
										autoComplete="one-time-code"
										maxLength={1}
										value={digit}
										onChange={(event) => handleDigitChange(index, event.target.value)}
										onKeyDown={(event) => handleDigitKeyDown(index, event.key)}
										onPaste={(event) => {
											event.preventDefault();
											handleDigitPaste(index, event.clipboardData.getData("text"));
										}}
										aria-label={`OTP digit ${index + 1}`}
										aria-invalid={errors.otp ? "true" : "false"}
										className={`h-12 w-full rounded-xl border bg-slate-50 text-center text-lg font-semibold text-[#17365d] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#27b8d2]/10 ${errors.otp ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#27b8d2]"}`}
									/>
								))}
							</div>
						</div>

						{errors.otp ? (
							<p className="-mt-3 mb-5 text-sm text-red-600">{errors.otp.message}</p>
						) : null}

						<button
							type="submit"
							disabled={isSubmitting}
							className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-lg shadow-[#27b8d2]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#27b8d2]/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
							style={{ backgroundImage: "linear-gradient(90deg, #27b8d2 0%, #1a93a8 100%)" }}
						>
							{isSubmitting ? (
								<>
									<Spinner />
									Verifying OTP...
								</>
							) : (
								"Verify OTP"
							)}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-slate-500">
						Back to{" "}
						<Link
							href="/forgot_pwd"
							className="font-semibold text-[#27b8d2] transition hover:text-[#17365d] hover:underline"
						>
							Forgot Password
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
