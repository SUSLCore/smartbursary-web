import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
	return (
		<header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
						<Image
							src="/favicon.ico"
							alt="SmartBursery logo"
							width={28}
							height={28}
							priority
						/>
					</span>
					<div className="leading-tight">
						<p className="text-lg font-semibold tracking-wide text-slate-900 sm:text-xl">
							SmartBursery
						</p>
						<p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
							Bursary Management Portal
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-3">
					<button
						type="button"
						className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
					>
						Profile
					</button>
					<button
						type="button"
						className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
					>
						Logout
					</button>
				</div>
			</nav>
		</header>
	);
}
