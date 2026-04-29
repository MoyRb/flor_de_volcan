import { Sidebar } from "@/components/sidebar";

export const dynamic = "force-dynamic";

export default function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen bg-[#faf7f2] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}
