"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation";

const icons = ["◧", "⌂", "+", "▥", "⚙"];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fdv-sidebar px-5 py-6">
      <div className="rounded-2xl border border-fdv-line bg-fdv-card p-5">
        <div className="mx-auto flex min-h-[96px] w-full items-center justify-center rounded-xl bg-white p-3">
          <Image
            src="/branding/logo-flor-del-volcan.png"
            alt="Flor del Volcán"
            width={260}
            height={90}
            priority
            className="h-auto max-h-20 w-auto max-w-full object-contain"
          />
        </div>
        <p className="mt-3 text-center text-xs tracking-[0.2em] text-fdv-muted">CONTROL DE FERMENTACIÓN</p>
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
