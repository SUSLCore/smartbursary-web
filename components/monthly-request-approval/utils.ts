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
] as const;

export function formatMonthLabel(month: number, year: number) {
  const label = MONTH_NAMES[month - 1] ?? `Month ${month}`;
  return `${label} ${year}`;
}

export function formatDocumentMonth(record: MonthlyDocumentRecord) {
  return formatMonthLabel(record.month, record.year);
}

export function formatUploadMonth(item: MonthlyMyUploadItem) {
  return formatMonthLabel(item.month, item.year);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getFileName(path: string) {
  return path.split("\\").pop() ?? path;
}
