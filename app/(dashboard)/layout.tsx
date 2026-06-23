import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(39, 184, 210, 0.12), transparent 34%), linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%)",
      }}
    >
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
