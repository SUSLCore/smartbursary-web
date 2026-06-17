"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFaculties, type Faculty } from "@/services/admin.service";

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

export default function FacultiesPage() {
	const router = useRouter();
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadFaculties = async () => {
			try {
				setError("");
				const data = await getFaculties();
				setFaculties(data);
			} catch (error: unknown) {
				setError(
					getErrorMessage(
						error,
						"Failed to load faculties"
					)
				);
			} finally {
				setLoading(false);
			}
		};

		loadFaculties();
	}, []);

	return (
		<div className="space-y-8 p-8">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold">Faculties</h1>
					<p className="mt-2 text-sm text-slate-600">
						Choose a faculty to manage its officers and departments.
					</p>
				</div>

				<button
					onClick={() => router.push("/admin")}
					className="rounded-lg border px-4 py-2 text-sm font-medium"
				>
					Back to admin
				</button>
			</div>

			{loading ? (
				<div className="rounded-xl border bg-white p-6 text-slate-600 shadow-sm">
					Loading faculties...
				</div>
			) : error ? (
				<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
					{error}
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{faculties.map((faculty) => (
						<button
							key={faculty.id}
							onClick={() =>
								router.push(`/admin/faculties/${faculty.id}`)
							}
							className="rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
						>
							<div className="text-lg font-semibold text-slate-900">
								{faculty.name}
							</div>
							<div className="mt-2 text-sm text-slate-600">
								Open faculty management for officer and department setup.
							</div>
						</button>
					))}

					{!faculties.length && (
						<div className="rounded-xl border bg-white p-6 text-slate-600 shadow-sm">
							No faculties found.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
