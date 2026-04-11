"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fdv-sidebar px-4 py-5">
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
        <p className="font-brand text-xl text-fdv-linen">Flor del Volcán</p>
        <p className="text-xs text-fdv-linen/80">Sistema operativo de vinificación</p>
      </div>

      <nav className="mt-5 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-2 transition ${
                active ? "bg-fdv-clay text-white" : "text-fdv-linen/85 hover:bg-white/10"
              }`}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-[11px] opacity-80">{item.description}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-fdv-linen/20 bg-white/5 p-3 text-xs text-fdv-linen/90">
        <p className="font-semibold">MVP sin autenticación</p>
        <p>Versión inicial para operación individual.</p>
      </div>
    </aside>
  );
}
