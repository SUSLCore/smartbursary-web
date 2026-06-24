"use client";

type ConfirmationCardProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmationCard({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationCardProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-card-title"
        aria-describedby="confirmation-card-description"
        className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.3)] ring-1 ring-black/5"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`h-2 w-full ${
            destructive
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-[#27b8d2] to-[#17365d]"
          }`}
        />

        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                destructive ? "bg-red-50 text-red-600" : "bg-sky-50 text-[#17365d]"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />
                <path
                  d="M10.3 4.5h3.4L20 14a2 2 0 0 1-1.7 3H5.7A2 2 0 0 1 4 14L10.3 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h3
                id="confirmation-card-title"
                className="text-lg font-bold text-[#17365d]"
              >
                {title}
              </h3>
              <p
                id="confirmation-card-description"
                className="mt-2 text-sm leading-6 text-slate-600"
              >
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
                destructive
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-[#17365d] hover:bg-[#27b8d2] hover:text-[#17365d]"
              }`}
            >
              {loading ? "Please wait..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
