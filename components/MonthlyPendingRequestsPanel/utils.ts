import type { NoticeTone } from "./types";
import type {
  MonthlyDocumentRecord,
  MonthlyMyUploadItem,
} from "@/services/monthlyFlow.service";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function noticeClassName(tone: NoticeTone) {
  if (tone === "error") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-[#27b8d2]/30 bg-[#27b8d2]/5 text-[#17365d]";
}

export function formatMonth(record: Pick<MonthlyDocumentRecord, "month" | "year">) {
  const label = MONTH_NAMES[record.month - 1] ?? `Month ${record.month}`;

  return `${label} ${record.year}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatMyUploadPeriod(
  item: Pick<MonthlyMyUploadItem, "month" | "year">
) {
  const label = MONTH_NAMES[item.month - 1] ?? `Month ${item.month}`;

  return `${label} ${item.year}`;
}

export function getFileName(path: string) {
  return path.split("\\").pop() ?? path;
}
