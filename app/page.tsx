import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

type MeApiResponse = {
	success: boolean;
	message: string;
	user?: {
		role?: string;
	};
};

export default async function Home() {
  const cookieStore = await cookies();
	const API_SERVER_BASE_URL =
		process.env.API_SERVER_BASE_URL ?? "http://localhost:5000/api";

	let dashboardPath: string | null = null;
	try {
		const response = await fetch(`${API_SERVER_BASE_URL}/auth/me`, {
			method: "GET",
			headers: {
				Cookie: cookieStore.toString(),
			},
			cache: "no-store",
		});

		if (response.ok) {
			const data = (await response.json()) as MeApiResponse;
			if (data.success && data.user?.role) {
				dashboardPath = getDashboardPathFromRole(data.user.role);
			}
		}
	} catch {
		dashboardPath = null;
	}

  if (dashboardPath) {
    redirect(dashboardPath);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
          <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            SmartBursery
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Welcome to SmartBursery
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A simple bursary management platform for students, faculty, and admins.
            Login to continue or create a new student account.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
