"use client";

import { FormEvent, useMemo, useState } from "react";

import authService from "@/services/auth.service";

type Faculty = {
	id: number;
	name: string;
	code: string;
};

type Department = {
	id: number;
	name: string;
	facultyId: number;
};

const faculties: Faculty[] = [
	{ id: 1, name: "Faculty of Agricultural Sciences", code: "FAS" },
	{ id: 2, name: "Faculty of Applied Sciences", code: "FAPS" },
	{ id: 3, name: "Faculty of Geomatics", code: "FG" },
	{ id: 4, name: "Faculty of Management Studies", code: "FMS" },
	{ id: 5, name: "Faculty of Social Sciences & Languages", code: "FSSL" },
	{ id: 6, name: "Faculty of Medicine", code: "FM" },
	{ id: 7, name: "Faculty of Technology", code: "FT" },
	{ id: 8, name: "Faculty of Computing", code: "FC" },
];

const departments: Department[] = [
	{ id: 1, name: "Agribusiness Management", facultyId: 1 },
	{ id: 2, name: "Export Agriculture", facultyId: 1 },
	{ id: 3, name: "Livestock Production", facultyId: 1 },
	{ id: 4, name: "Food Science & Technology", facultyId: 1 },
	{ id: 5, name: "Natural Resources", facultyId: 2 },
	{ id: 6, name: "Physical Sciences & Technology", facultyId: 2 },
	{ id: 7, name: "Computing & Information Systems", facultyId: 2 },
	{ id: 8, name: "Sports Sciences & Physical Education", facultyId: 2 },
	{ id: 9, name: "CPRSG", facultyId: 3 },
	{ id: 10, name: "Surveying and Geodesy", facultyId: 3 },
	{ id: 11, name: "Accountancy and Finance", facultyId: 4 },
	{ id: 12, name: "Business Management", facultyId: 4 },
	{ id: 13, name: "Marketing Management", facultyId: 4 },
	{ id: 14, name: "Tourism Management", facultyId: 4 },
	{ id: 15, name: "Economics and Statistics", facultyId: 5 },
	{ id: 16, name: "English Language Teaching", facultyId: 5 },
	{ id: 17, name: "Languages", facultyId: 5 },
	{ id: 18, name: "Social Sciences", facultyId: 5 },
	{ id: 19, name: "Biosystems Technology", facultyId: 7 },
	{ id: 20, name: "Engineering Technology", facultyId: 7 },
	{ id: 21, name: "Department of Computing & Information Systems", facultyId: 8 },
	{ id: 22, name: "Department of Software Engineering", facultyId: 8 },
	{ id: 23, name: "Department of Data Science", facultyId: 8 },
];

type FormState = {
	registerId: string;
	name: string;
	email: string;
	password: string;
	phone: string;
	facultyId: string;
	departmentId: string;
};

const initialForm: FormState = {
	registerId: "",
	name: "",
	email: "",
	password: "",
	phone: "",
	facultyId: "",
	departmentId: "",
};

export default function RegisterPage() {
	const [form, setForm] = useState<FormState>(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const availableDepartments = useMemo(() => {
		if (!form.facultyId) {
			return [];
		}

		const selectedFacultyId = Number(form.facultyId);
		return departments.filter(
			(department) => department.facultyId === selectedFacultyId,
		);
	}, [form.facultyId]);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage("");
		setError("");

		if (!form.facultyId || !form.departmentId) {
			setError("Please select both faculty and department.");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await authService.registerStudent({
				registerId: form.registerId,
				name: form.name,
				email: form.email,
				password: form.password,
				phone: form.phone,
				facultyId: Number(form.facultyId),
				departmentId: Number(form.departmentId),
			});

			setMessage(response.message || "Student registered successfully.");
			setForm(initialForm);
		} catch (submitError: unknown) {
			if (
				typeof submitError === "object" &&
				submitError !== null &&
				"response" in submitError
			) {
				const response = (submitError as {
					response?: { data?: { message?: string } };
				}).response;

				setError(
					response?.data?.message ??
						"Registration failed. Please check your details and try again.",
				);
			} else {
				setError("Registration failed. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
				<div className="mb-8 space-y-2">
					<p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
						SmartBursery
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Create student account
					</h1>
					<p className="text-sm text-slate-600">
						Select faculty first, then choose a department and complete registration.
					</p>
				</div>

				<form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Register ID</span>
						<input
							required
							value={form.registerId}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, registerId: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
							placeholder="2021ICT001"
						/>
					</label>

					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Full name</span>
						<input
							required
							value={form.name}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, name: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
							placeholder="Binoj Madhuranga"
						/>
					</label>

					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Email</span>
						<input
							required
							type="email"
							value={form.email}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, email: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
							placeholder="binoj@student.com"
						/>
					</label>

					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Phone number</span>
						<input
							required
							value={form.phone}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, phone: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
							placeholder="0771234567"
						/>
					</label>

					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Password</span>
						<input
							required
							type="password"
							minLength={8}
							value={form.password}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, password: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
							placeholder="********"
						/>
					</label>

					<label className="space-y-2 sm:col-span-1">
						<span className="text-sm font-medium text-slate-700">Faculty</span>
						<select
							required
							value={form.facultyId}
							onChange={(event) =>
								setForm((prev) => ({
									...prev,
									facultyId: event.target.value,
									departmentId: "",
								}))
							}
							className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500"
						>
							<option value="">Select faculty</option>
							{faculties.map((faculty) => (
								<option key={faculty.id} value={faculty.id}>
									{faculty.name} ({faculty.code})
								</option>
							))}
						</select>
					</label>

					<label className="space-y-2 sm:col-span-2">
						<span className="text-sm font-medium text-slate-700">Department</span>
						<select
							required
							disabled={!form.facultyId}
							value={form.departmentId}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, departmentId: event.target.value }))
							}
							className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
						>
							<option value="">
								{form.facultyId
									? "Select department"
									: "Select faculty first"}
							</option>
							{availableDepartments.map((department) => (
								<option key={department.id} value={department.id}>
									{department.name}
								</option>
							))}
						</select>
					</label>

					{error ? (
						<p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</p>
					) : null}

					{message ? (
						<p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
							{message}
						</p>
					) : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="sm:col-span-2 inline-flex justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? "Registering..." : "Register student"}
					</button>
				</form>
			</div>
		</div>
	);
}
