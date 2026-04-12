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

const TOKEN_COOKIE_NAMES = ["token", "authToken", "accessToken", "jwt"];
const ROLE_COOKIE_NAMES = ["role", "userRole"];

function getDashboardPathFromRole(role: string | null) {
  if (!role) {
    return null;
  }

  return ROLE_TO_DASHBOARD_PATH[role.toUpperCase()] ?? null;
}

function getRoleFromJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const decodedPayload = Buffer.from(payload, "base64url").toString("utf-8");
    const parsedPayload = JSON.parse(decodedPayload) as {
      role?: string;
      user?: { role?: string };
    };

    return parsedPayload.role ?? parsedPayload.user?.role ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const cookieStore = await cookies();

  let roleFromCookie: string | null = null;
  for (const roleCookieName of ROLE_COOKIE_NAMES) {
    const roleValue = cookieStore.get(roleCookieName)?.value;
    if (roleValue) {
      roleFromCookie = roleValue;
      break;
    }
  }

  let roleFromToken: string | null = null;
  for (const tokenCookieName of TOKEN_COOKIE_NAMES) {
    const tokenValue = cookieStore.get(tokenCookieName)?.value;
    if (tokenValue) {
      roleFromToken = getRoleFromJwt(tokenValue);
      break;
    }
  }

  const dashboardPath =
    getDashboardPathFromRole(roleFromCookie) ||
    getDashboardPathFromRole(roleFromToken);

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
