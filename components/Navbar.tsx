"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { logoutUser } from "@/features/auth/authThunk";
import { AppDispatch } from "@/redux/store";

export default function Navbar() {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		if (isLoggingOut) {
			return;
		}

		setIsLoggingOut(true);
		try {
			await dispatch(logoutUser()).unwrap();
		} catch {
			// Even if API fails, local auth state is cleared by the rejected case.
		} finally {
			setIsLoggingOut(false);
			router.replace("/login");
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#17365d] via-[#1c3f6b] to-[#17365d] shadow-md shadow-[#17365d]/20">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<Link href="/" className="group flex items-center gap-3">
					<span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-md ring-2 ring-[#27b8d2]/40 transition-all duration-200 group-hover:scale-105 group-hover:ring-[#27b8d2]">
						<Image
							src="/favicon.ico"
							alt="SmartBursery logo"
							width={28}
							height={28}
							priority
							className="rounded-lg"
						/>
					</span>
					<div className="leading-tight">
						<p className="text-lg font-semibold tracking-wide text-white sm:text-xl">
							SmartBursery
						</p>
						<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#27b8d2]">
							Bursary Management Portal
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-3">
					<button
						type="button"
						className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-white/10 hover:text-white"
					>
						Profile
					</button>
					<button
						type="button"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="rounded-full bg-[#27b8d2] px-5 py-2 text-sm font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-[#27b8d2]/40 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoggingOut ? "Logging out..." : "Logout"}
					</button>
				</div>
			</nav>
		</header>
	);
}