import { Sidebar } from "@/components/sidebar";

export default function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
      <Sidebar />
      <main className="bg-fdv-cream p-5 lg:p-7">{children}</main>
    </div>
  );
}
