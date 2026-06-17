import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authService from "@/services/auth.service";

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

function getDashboardPathFromRole(role: string | undefined) {
  if (!role) {
    return null;
  }

  return ROLE_TO_DASHBOARD_PATH[role.toUpperCase()] ?? null;
}

export default async function Home() {
  const cookieStore = await cookies();

	let dashboardPath: string | null = null;
	try {
    const data = await authService.meWithCookie(cookieStore.toString());
    if (data.success && data.user?.role) {
      dashboardPath = getDashboardPathFromRole(data.user.role);
		}
	} catch {
		dashboardPath = null;
	}

  if (dashboardPath) {
    redirect(dashboardPath);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e9ebf2]">
      {/* Decorative background accent (desktop only, mirrors login/register pages) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -left-24 top-0 h-[120%] w-[40%] rotate-[-3deg] bg-gradient-to-br from-[#27b8d2] to-[#1a93a8]" />
        <div className="absolute left-0 top-0 h-full w-[28%] bg-[#27b8d2]/95" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-2 bg-gradient-to-r from-[#27b8d2] via-[#17365d] to-[#27b8d2] sm:block lg:hidden" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(23,54,93,0.25)] ring-1 ring-black/5">
          <div className="h-2 w-full bg-gradient-to-r from-[#27b8d2] to-[#17365d]" />

          <div className="p-8 sm:p-12">
            <p className="inline-flex rounded-full bg-[#e9ebf2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#17365d]">
              SmartBursery
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#17365d] sm:text-5xl">
              Welcome to SmartBursery
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A simple bursary management platform for students, faculty, and admins.
              Login to continue or create a new student account.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#27b8d2] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1ca9c3] hover:shadow-lg active:scale-[0.99]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#d7dce6] bg-[#f8f9fb] px-6 py-3 text-sm font-semibold text-[#17365d] transition hover:border-[#27b8d2] hover:bg-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}