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
          text: `Loaded ${response.count ?? response.data?.length ?? 0} eligible students for department ${departmentIdValue} and batch ${batchIdValue}.`,
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

        if (!active) {
          return;
        }

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
        if (!active) {
          return;
        }

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
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    }

    if (tone === "success") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="p-6 sm:p-8">
            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Yearly bursary workflow
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Upload bursary available list
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Upload the yearly bursary availability workbook, inspect department allocations, check a single register ID, and remove entries when the available list changes.
            </p>
          </div>

          <div className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Quick status
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Selected batch
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {selectedBatch?.name ?? "Not selected"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Selected department
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {selectedDepartment?.name ?? "Not selected"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Faculty: {selectedDepartment?.Faculty?.name ?? "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {metaNotice && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${noticeClassName(
            metaNotice.tone
          )}`}
        >
          {metaNotice.text}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <form
            onSubmit={handleUpload}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Upload bursary available list
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  The batch and department are loaded from the backend. Pick the registered values and upload the Excel file.
                </p>
              </div>

              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Template format: xlsx / xls / csv
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Batch
                <select
                  value={selectedBatchId}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  disabled={loadingMeta || batches.length === 0}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Department
                <select
                  value={selectedDepartmentId}
                  onChange={(event) => setSelectedDepartmentId(event.target.value)}
                  disabled={loadingMeta || departments.length === 0}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Faculty
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {selectedDepartment?.Faculty?.name ?? "Select a department"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Faculty ID: {selectedDepartment?.facultyId ?? "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Registered IDs
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  Batch {selectedBatch?.name ?? "-"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Department {selectedDepartment?.name ?? "-"}
                </p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium text-slate-700">
              Excel file
              <div className="mt-2 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-slate-400 hover:bg-slate-100">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setUploadNotice(emptyNotice);
                  }}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
              </div>
            </label>

            {file && (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                Selected file: <span className="font-semibold">{file.name}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || loadingMeta}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? "Uploading..." : "Upload bursary available list"}
            </button>

            {uploadNotice && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${noticeClassName(
                  uploadNotice.tone
                )}`}
              >
                {uploadNotice.text}
              </div>
            )}

            {uploadStats && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Batch
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {uploadStats.batchId}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Department
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {uploadStats.departmentId}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Students
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {uploadStats.totalStudents}
                  </p>
                </div>
              </div>
            )}
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Find department students
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Use a separate department and batch selection to load the eligible student list.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={loadingStudents || !finderDepartmentId || !finderBatchId}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingStudents ? "Loading..." : "Load students"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Batch
                <select
                  value={finderBatchId}
                  onChange={(event) => {
                    setFinderBatchId(event.target.value);
                    setStudents([]);
                    setStudentNotice(emptyNotice);
                  }}
                  disabled={loadingMeta || batches.length === 0}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Department
                <select
                  value={finderDepartmentId}
                  onChange={(event) => {
                    setFinderDepartmentId(event.target.value);
                    setStudents([]);
                    setStudentNotice(emptyNotice);
                  }}
                  disabled={loadingMeta || departments.length === 0}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100"
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Finder batch
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {finderBatch?.name ?? "Select a batch"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Finder department
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {finderDepartment?.name ?? "Select a department"}
                </p>
              </div>
            </div>

            {studentNotice && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${noticeClassName(
                  studentNotice.tone
                )}`}
              >
                {studentNotice.text}
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Register ID</th>
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Account</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No students loaded yet. Select a batch and department, then click Load students.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="align-top">
                          <td className="px-4 py-4 font-medium text-slate-900">
                            {student.registerId}
                          </td>
                          <td className="px-4 py-4 text-slate-700">
                            {student.studentName}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {student.accountNumber ?? "-"}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {student.amount ?? "-"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(student.id)}
                              disabled={removingId === student.id}
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >
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
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Check eligibility
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter a register ID to verify whether the student is already in the eligible list.
            </p>

            <form onSubmit={handleCheckEligibility} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Register ID
                <input
                  type="text"
                  value={registerId}
                  onChange={(event) => setRegisterId(event.target.value)}
                  placeholder="21CSE0158"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>

              <button
                type="submit"
                disabled={checking}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checking ? "Checking..." : "Check eligibility"}
              </button>
            </form>

            {eligibilityNotice && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${noticeClassName(
                  eligibilityNotice.tone
                )}`}
              >
                {eligibilityNotice.text}
              </div>
            )}

            {eligibilityResult?.student && (
              <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Matched student
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
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

          <Link
            href="/faculty-ma"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
        </aside>
      </section>
    </div>
  );
}
