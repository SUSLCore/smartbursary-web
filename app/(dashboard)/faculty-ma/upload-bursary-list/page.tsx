"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Batch } from "@/types/batch.types";
import type { Department } from "@/types/department.types";
import {
  facultyMAService,
  type EligibleStudent,
} from "@/services/facultyMA.service";

type NoticeTone = "success" | "error" | "info";

type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;

const emptyNotice: NoticeState = null;

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M11 5 5 12l6 7M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M7 17a4 4 0 0 1-1-7.87A5 5 0 0 1 16.9 8.1 4.5 4.5 0 0 1 16.5 17H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11v7m0-7 2.5 2.5M12 11 9.5 13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UploadBursaryListPage() {
  const [file, setFile] = useState<File | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaNotice, setMetaNotice] = useState<NoticeState>(emptyNotice);

  const [uploading, setUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<NoticeState>(emptyNotice);
  const [uploadStats, setUploadStats] = useState<{
    batchId: number;
    departmentId: number;
    totalStudents: number;
  } | null>(null);

  const [finderBatchId, setFinderBatchId] = useState("");
  const [finderDepartmentId, setFinderDepartmentId] = useState("");
  const [students, setStudents] = useState<EligibleStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentNotice, setStudentNotice] = useState<NoticeState>(emptyNotice);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [registerId, setRegisterId] = useState("");
  const [checking, setChecking] = useState(false);
  const [eligibilityNotice, setEligibilityNotice] =
    useState<NoticeState>(emptyNotice);
  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    student?: {
      id: number;
      registerId: string;
      studentName: string;
    };
  } | null>(null);

  const selectedBatch = batches.find(
    (batch) => String(batch.id) === selectedBatchId
  );

  const selectedDepartment = departments.find(
    (department) => String(department.id) === selectedDepartmentId
  );

  const finderBatch = batches.find(
    (batch) => String(batch.id) === finderBatchId
  );

  const finderDepartment = departments.find(
    (department) => String(department.id) === finderDepartmentId
  );

  const loadDepartmentStudents = useCallback(
    async (departmentIdValue: number, batchIdValue: number) => {
      if (!departmentIdValue || !batchIdValue) {
        setStudentNotice({
          tone: "error",
          text: "Please choose both a department and a batch before loading students.",
        });
        return;
      }

      try {
        setLoadingStudents(true);
        setStudentNotice(emptyNotice);

        const response = await facultyMAService.getDepartmentStudents(
          departmentIdValue,
          batchIdValue
        );

        setStudents(response.data ?? []);
        setStudentNotice({
          tone: "success",
          text: `Loaded ${
            response.count ?? response.data?.length ?? 0
          } eligible students for department ${departmentIdValue} and batch ${batchIdValue}.`,
        });
      } catch (error) {
        console.error(error);
        setStudentNotice({
          tone: "error",
          text: "Could not load department students. Please try again.",
        });
      } finally {
        setLoadingStudents(false);
      }
    },
    []
  );

  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setMetaNotice(emptyNotice);

        const [batchResponse, departmentResponse] = await Promise.all([
          facultyMAService.getBatches(),
          facultyMAService.getDepartments(),
        ]);

        if (!active) return;

        const nextBatches = batchResponse.batches ?? [];
        const nextDepartments = departmentResponse.data ?? [];

        setBatches(nextBatches);
        setDepartments(nextDepartments);

        setSelectedBatchId((current) =>
          current && nextBatches.some((batch) => String(batch.id) === current)
            ? current
            : String(nextBatches[0]?.id ?? "")
        );

        setSelectedDepartmentId((current) =>
          current &&
          nextDepartments.some(
            (department) => String(department.id) === current
          )
            ? current
            : String(nextDepartments[0]?.id ?? "")
        );

        setFinderBatchId((current) =>
          current && nextBatches.some((batch) => String(batch.id) === current)
            ? current
            : String(nextBatches[0]?.id ?? "")
        );

        setFinderDepartmentId((current) =>
          current &&
          nextDepartments.some(
            (department) => String(department.id) === current
          )
            ? current
            : String(nextDepartments[0]?.id ?? "")
        );

        setMetaNotice({
          tone: "success",
          text: "Registered batches and Faculty MA departments loaded successfully.",
        });
      } catch (error) {
        console.error(error);

        if (!active) return;

        setMetaNotice({
          tone: "error",
          text: "Could not load batches or departments.",
        });
      } finally {
        if (active) {
          setLoadingMeta(false);
        }
      }
    };

    void loadMeta();

    return () => {
      active = false;
    };
  }, []);

  const handleLoadStudents = () => {
    const parsedDepartmentId = toNumber(finderDepartmentId);
    const parsedBatchId = toNumber(finderBatchId);

    if (parsedDepartmentId && parsedBatchId) {
      void loadDepartmentStudents(parsedDepartmentId, parsedBatchId);
    } else {
      setStudentNotice({
        tone: "error",
        text: "Please choose both a department and a batch before loading students.",
      });
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedBatchId = toNumber(selectedBatchId);
    const parsedDepartmentId = toNumber(selectedDepartmentId);
    const parsedFacultyId = selectedDepartment?.facultyId ?? null;

    if (!file) {
      setUploadNotice({
        tone: "error",
        text: "Please choose the Excel file before uploading.",
      });
      return;
    }

    if (!parsedBatchId || !parsedDepartmentId || !parsedFacultyId) {
      setUploadNotice({
        tone: "error",
        text: "Please choose a registered batch and department before uploading.",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadNotice(emptyNotice);

      const response = await facultyMAService.uploadEligibleStudents({
        file,
        batchId: parsedBatchId,
        facultyId: parsedFacultyId,
        departmentId: parsedDepartmentId,
      });

      setUploadStats({
        batchId: response.batchId,
        departmentId: response.departmentId,
        totalStudents: response.totalStudents,
      });

      setUploadNotice({
        tone: "success",
        text: response.message,
      });
    } catch (error) {
      console.error(error);
      setUploadNotice({
        tone: "error",
        text: "The upload failed. Please check the file format and try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCheckEligibility = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedRegisterId = registerId.trim();

    if (!trimmedRegisterId) {
      setEligibilityNotice({
        tone: "error",
        text: "Please enter a register ID before checking eligibility.",
      });
      return;
    }

    try {
      setChecking(true);
      setEligibilityNotice(emptyNotice);
      setEligibilityResult(null);

      const response =
        await facultyMAService.checkEligibility(trimmedRegisterId);

      setEligibilityResult(response);
      setEligibilityNotice({
        tone: response.eligible ? "success" : "info",
        text: response.eligible
          ? "This student is eligible."
          : "This student is not currently eligible.",
      });
    } catch (error) {
      console.error(error);
      setEligibilityNotice({
        tone: "error",
        text: "Could not verify eligibility. Please try again.",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    try {
      setRemovingId(studentId);

      const response = await facultyMAService.removeEligibleStudent(studentId);

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.id !== studentId)
      );

      setStudentNotice({
        tone: "success",
        text: response.message,
      });
    } catch (error) {
      console.error(error);
      setStudentNotice({
        tone: "error",
        text: "Could not remove the student right now.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const noticeClassName = (tone: NoticeTone) => {
    if (tone === "error") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (tone === "success") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
  };

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#27b8d2] focus:ring-4 focus:ring-[#27b8d2]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

  const selectClassName = `${inputClassName} appearance-none pr-11`;

  const panelClassName =
    "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50";

  const accentBar = (
    <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#27b8d2] to-[#17365d]" />
  );

  return (
    <div className="space-y-7">
      <section className={`${panelClassName} sm:p-8`}>
        {accentBar}

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#27b8d2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#17365d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
            Yearly bursary workflow
          </span>

          <Link
            href="/faculty-ma"
            className="inline-flex items-center gap-2 rounded-full border border-[#17365d]/15 bg-white px-4 py-2 text-sm font-medium text-[#17365d] shadow-sm transition-all duration-200 hover:border-[#27b8d2]/50 hover:bg-[#27b8d2]/5"
          >
            <ArrowLeftIcon />
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
              Upload bursary available list
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Upload eligible student lists, review department records, check
              eligibility, and manage bursary list changes in one workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Batch
              </p>
              <p className="mt-1 text-lg font-semibold text-[#17365d]">
                {selectedBatch?.name ?? "Not selected"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Department
              </p>
              <p className="mt-1 text-lg font-semibold text-[#17365d]">
                {selectedDepartment?.name ?? "Not selected"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {metaNotice && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
            metaNotice.tone
          )}`}
        >
          {metaNotice.text}
        </div>
      )}

      <form onSubmit={handleUpload} className={`${panelClassName} sm:p-8`}>
        {accentBar}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27b8d2]">
                  Step 1
                </span>
                <h2 className="mt-1 text-xl font-semibold text-[#17365d]">
                  Upload eligible list
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Choose the correct batch and department, then upload the
                  Excel file using the required bursary format.
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-[#27b8d2]/30 bg-[#27b8d2]/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17365d]">
                XLSX / XLS / CSV
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-[#17365d]">
                Batch
                <div className="relative mt-2">
                  <select
                    value={selectedBatchId}
                    onChange={(event) => setSelectedBatchId(event.target.value)}
                    disabled={loadingMeta || batches.length === 0}
                    className={selectClassName}
                  >
                    <option value="">Select a batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>

              <label className="block text-sm font-medium text-[#17365d]">
                Department
                <div className="relative mt-2">
                  <select
                    value={selectedDepartmentId}
                    onChange={(event) =>
                      setSelectedDepartmentId(event.target.value)
                    }
                    disabled={loadingMeta || departments.length === 0}
                    className={selectClassName}
                  >
                    <option value="">Select a department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>
            </div>

            <label className="mt-6 block text-sm font-medium text-[#17365d]">
              Excel file
              <div className="mt-2 rounded-3xl border-2 border-dashed border-[#27b8d2]/30 bg-[#27b8d2]/5 p-6 text-center transition-all duration-200 hover:border-[#27b8d2]/60 hover:bg-[#27b8d2]/10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#27b8d2] shadow-sm">
                  <UploadCloudIcon />
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setUploadNotice(emptyNotice);
                  }}
                  className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#27b8d2] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-[#17365d] file:transition-colors file:duration-200 hover:file:bg-[#17365d] hover:file:text-white"
                />

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Accepted formats: XLSX, XLS, or CSV.
                </p>
              </div>
            </label>

            {file && (
              <div className="mt-4 rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3 text-sm text-slate-700">
                Selected file:{" "}
                <span className="font-semibold text-[#17365d]">{file.name}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || loadingMeta}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#27b8d2] px-5 py-3.5 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? "Uploading..." : "Upload bursary available list"}
            </button>

            {uploadNotice && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
                  uploadNotice.tone
                )}`}
              >
                {uploadNotice.text}
              </div>
            )}

            {uploadStats && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Batch", uploadStats.batchId],
                  ["Department", uploadStats.departmentId],
                  ["Students", uploadStats.totalStudents],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#17365d]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
      </form>

      <div className="flex items-center gap-2 px-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#27b8d2]" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Step 2 · Review & manage
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section className={panelClassName}>
          {accentBar}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#17365d]">
                Department students
              </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Pick any batch and department to browse its eligible
                  list — this can be different from the one uploaded above.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={
                  loadingStudents || !finderDepartmentId || !finderBatchId
                }
                className="rounded-2xl bg-[#17365d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0f2742] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingStudents ? "Loading..." : "Load students"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-[#17365d]">
                Batch
                <div className="relative mt-2">
                  <select
                    value={finderBatchId}
                    onChange={(event) => {
                      setFinderBatchId(event.target.value);
                      setStudents([]);
                      setStudentNotice(emptyNotice);
                    }}
                    disabled={loadingMeta || batches.length === 0}
                    className={selectClassName}
                  >
                    <option value="">Select a batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>

              <label className="block text-sm font-medium text-[#17365d]">
                Department
                <div className="relative mt-2">
                  <select
                    value={finderDepartmentId}
                    onChange={(event) => {
                      setFinderDepartmentId(event.target.value);
                      setStudents([]);
                      setStudentNotice(emptyNotice);
                    }}
                    disabled={loadingMeta || departments.length === 0}
                    className={selectClassName}
                  >
                    <option value="">Select a department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Finder batch
                </p>
                <p className="mt-1 font-semibold text-[#17365d]">
                  {finderBatch?.name ?? "Select a batch"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-[#e9ebf2]/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Finder department
                </p>
                <p className="mt-1 font-semibold text-[#17365d]">
                  {finderDepartment?.name ?? "Select a department"}
                </p>
              </div>
            </div>

            {studentNotice && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
                  studentNotice.tone
                )}`}
              >
                {studentNotice.text}
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#17365d] text-left text-xs uppercase tracking-[0.16em] text-white">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Register ID</th>
                      <th className="px-4 py-4 font-semibold">Student</th>
                      <th className="px-4 py-4 font-semibold">Account</th>
                      <th className="px-4 py-4 font-semibold">Amount</th>
                      <th className="px-4 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          No students loaded yet. Select a batch and department,
                          then click Load students.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr
                          key={student.id}
                          className="transition-colors duration-150 hover:bg-[#27b8d2]/5"
                        >
                          <td className="px-4 py-4 font-semibold text-[#17365d]">
                            {student.registerId}
                          </td>
                          <td className="px-4 py-4 text-slate-700">
                            {student.studentName}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {student.accountNumber ?? "-"}
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-700">
                            {student.amount ?? "-"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(student.id)}
                              disabled={removingId === student.id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              <TrashIcon />
                              {removingId === student.id
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
        </section>

        <aside className="space-y-6">
          <section className={panelClassName}>
            {accentBar}

            <h2 className="text-xl font-semibold text-[#17365d]">
              Check eligibility
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter a register ID and verify whether the student is available
              in the eligible list.
            </p>

            <form onSubmit={handleCheckEligibility} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-[#17365d]">
                Register ID
                <input
                  type="text"
                  value={registerId}
                  onChange={(event) => setRegisterId(event.target.value)}
                  placeholder="21CSE0158"
                  className={inputClassName}
                />
              </label>

              <button
                type="submit"
                disabled={checking}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#27b8d2] px-5 py-3.5 font-semibold text-[#17365d] shadow-md shadow-[#27b8d2]/30 transition-all duration-200 hover:bg-[#17365d] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checking ? "Checking..." : "Check eligibility"}
              </button>
            </form>

            {eligibilityNotice && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${noticeClassName(
                  eligibilityNotice.tone
                )}`}
              >
                {eligibilityNotice.text}
              </div>
            )}

            {eligibilityResult?.student && (
              <div className="mt-4 rounded-2xl border border-[#27b8d2]/20 bg-[#27b8d2]/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27b8d2]">
                  Matched student
                </p>
                <p className="mt-2 text-lg font-semibold text-[#17365d]">
                  {eligibilityResult.student.studentName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Register ID: {eligibilityResult.student.registerId}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Student ID: {eligibilityResult.student.id}
                </p>
              </div>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}