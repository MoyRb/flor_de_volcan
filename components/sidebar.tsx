"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation";

const icons = ["◧", "⌂", "+", "▥", "⚙"];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fdv-sidebar px-5 py-6">
      <div className="rounded-2xl border border-fdv-line bg-fdv-card p-4">
        <svg viewBox="0 0 240 74" className="mb-3 h-16 w-full text-[#b8aea4]" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 53c14-6 28-8 42-7 22 2 36-10 50-24 16-16 26-20 42-18 14 1 21 10 30 20 9 11 15 16 24 20" />
          <path d="M118 37l6-12m0 0l5 12m-5-12v-8" />
          <path d="M20 52c18-8 37-8 55-2m-10 1c18-6 36-2 56 0m8-3c14 3 27 5 40 5" opacity=".65" />
        </svg>
        <p className="font-brand text-[2rem] leading-none text-fdv-heading">Flor del Volcán</p>
        <p className="mt-1 text-xs tracking-[0.2em] text-fdv-muted">CONTROL DE FERMENTACIÓN</p>
      </div>

      <nav className="mt-2 space-y-1.5">
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                active
                  ? "border-transparent bg-fdv-active text-fdv-heading"
                  : "border-transparent text-fdv-muted hover:border-fdv-line hover:bg-[#fffdfb]"
              }`}
            >
              <span className="text-sm opacity-70">{icons[i] ?? "•"}</span>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-[11px] opacity-90">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-fdv-line bg-fdv-card p-3 text-xs text-fdv-muted">
        <p className="font-medium text-fdv-heading">● Conectado</p>
        <p className="mt-1">Miércoles, 29 de abril de 2026</p>
      </div>
    </aside>
  );
}
