"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fdv-sidebar px-5 py-6">
      <div className="rounded-2xl border border-fdv-border bg-white p-4">
        <p className="font-brand text-2xl text-fdv-burgundy">Flor del Volcán</p>
        <p className="text-xs tracking-wide text-fdv-muted">Control de Fermentación</p>
      </div>

      <nav className="mt-4 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl border px-3 py-2 transition ${
                active
                  ? "border-fdv-clay bg-fdv-clay/10 text-fdv-burgundy"
                  : "border-transparent text-fdv-muted hover:border-fdv-border hover:bg-white"
              }`}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-[11px] opacity-90">{item.description}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-fdv-border bg-white p-3 text-xs text-fdv-muted">
        <p className="font-semibold text-fdv-ink">MVP operativo</p>
        <p>Navegación reducida al flujo central de vinificación.</p>
      </div>
    </aside>
  );
}
