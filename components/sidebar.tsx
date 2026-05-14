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
      <div className="rounded-3xl border border-fdv-line bg-fdv-card p-4 shadow-sm">
        <div className="rounded-2xl border border-fdv-line/70 bg-[#f6f0e7] px-4 py-3.5">
          <Image
            src="/branding/flor-del-volcan-logo.svg"
            alt="Flor del Volcán"
            width={320}
            height={118}
            priority
            loading="eager"
            className="mx-auto h-auto w-full max-w-[280px] object-contain"
          />
        </div>
        <p className="mt-3 text-center text-[11px] tracking-[0.24em] text-fdv-muted">CONTROL DE FERMENTACIÓN</p>
      </div>

      <nav className="mt-2 space-y-1.5">
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${
                active
                  ? "border-transparent bg-fdv-active text-fdv-heading shadow-sm"
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

      <div className="mt-auto rounded-2xl border border-fdv-line bg-fdv-card p-3 text-xs text-fdv-muted shadow-sm">
        <p className="font-medium text-fdv-heading">● Conectado</p>
        <p className="mt-1">Miércoles, 29 de abril de 2026</p>
      </div>
    </aside>
  );
}
