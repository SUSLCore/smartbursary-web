export default function Loading() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="h-4 w-40 rounded-full bg-slate-100" />
        <div className="mt-6 h-10 w-2/3 rounded-2xl bg-slate-100" />
        <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 rounded-full bg-slate-100" />
          <div className="mt-3 h-4 w-72 rounded-full bg-slate-100" />
          <div className="mt-6 h-14 rounded-2xl bg-slate-100" />
          <div className="mt-6 h-24 rounded-3xl bg-slate-100" />
          <div className="mt-6 h-12 rounded-2xl bg-slate-100" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-40 rounded-full bg-slate-100" />
          <div className="mt-3 h-4 w-56 rounded-full bg-slate-100" />
          <div className="mt-6 space-y-3">
            <div className="h-16 rounded-2xl bg-slate-100" />
            <div className="h-16 rounded-2xl bg-slate-100" />
            <div className="h-16 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
