import Image from "next/image";
import { createClient } from "@/src/lib/supabase/server";

function formatDate(value?: string) {
  if (!value) return "N/A";
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: lot } = await supabase
    .from("wine_lots")
    .select("id, lot_code, start_date, current_volume_liters")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lotId = lot?.id;
  const [metricsRes, eventsRes] = lotId
    ? await Promise.all([
        supabase
          .from("lot_daily_metrics")
          .select("metric_date, temperature_c, ph, brix")
          .eq("lot_id", lotId)
          .order("metric_date", { ascending: true })
          .limit(12),
        supabase
          .from("lot_stage_history")
          .select("started_at, comments")
          .eq("lot_id", lotId)
          .order("started_at", { ascending: false })
          .limit(5),
      ])
    : [{ data: [] }, { data: [] }];

  const metrics = metricsRes.data ?? [];
  const latest = metrics.at(-1);
  const dayCount = metrics.length || "-";

  return (
    <section className="space-y-5">
      <header className="fdv-panel overflow-hidden">
        <div className="border-b border-fdv-line px-6 py-5 text-center">
          <div className="mx-auto flex max-w-[420px] items-center justify-center rounded-2xl bg-white px-4 py-3">
            <Image
              src="/branding/logo-flor-del-volcan.png"
              alt="Flor del Volcán"
              width={420}
              height={140}
              priority
              className="h-auto max-h-28 w-auto max-w-full object-contain"
            />
          </div>
          <p className="mt-2 text-xs tracking-[0.32em] text-fdv-muted">CONTROL DE FERMENTACIÓN</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
          <div>
            <p className="text-3xl font-semibold text-fdv-heading">Lote Actual — {lot?.lot_code ?? "Sin lote activo"}</p>
            <p className="mt-1 text-fdv-muted">Día {dayCount} · {lot?.current_volume_liters ?? 0} litros · Última medición: {formatDate(latest?.metric_date)}</p>
          </div>
          <span className="fdv-badge fdv-badge-ok">Fermentando</span>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <article className="fdv-panel p-5">
          <h2 className="mb-3 text-3xl font-semibold text-fdv-heading">Brix vs Días</h2>
          <div className="rounded-2xl border border-fdv-line bg-[#fffcfa] p-4">
            <svg viewBox="0 0 100 36" className="h-64 w-full" preserveAspectRatio="none">
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1="0" y1={i * 7.2} x2="100" y2={i * 7.2} stroke="#ece4da" strokeWidth="0.35" />
              ))}
              {metrics.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#b86e5a"
                  strokeWidth="0.8"
                  points={metrics.map((m, i) => `${(i / (metrics.length - 1)) * 100},${34 - Number(m.brix ?? 0)}`).join(" ")}
                />
              )}
              {metrics.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#9daf90"
                  strokeWidth="0.7"
                  points={metrics.map((m, i) => `${(i / (metrics.length - 1)) * 100},${34 - Number(m.temperature_c ?? 0)}`).join(" ")}
                />
              )}
            </svg>
          </div>
        </article>

        <aside className="fdv-panel divide-y divide-fdv-line overflow-hidden p-0">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="fdv-badge fdv-badge-ok">Fermentando</span>
            <span className="text-sm text-fdv-muted">{new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="p-4"><p className="text-sm text-fdv-muted">Temperatura</p><p className="text-4xl text-fdv-heading">{latest?.temperature_c ?? "-"} °C</p></div>
          <div className="p-4"><p className="text-sm text-fdv-muted">pH</p><p className="text-4xl text-fdv-heading">{latest?.ph ?? "-"}</p></div>
          <div className="p-4"><p className="text-sm text-fdv-muted">°Brix</p><p className="text-4xl text-fdv-heading">{latest?.brix ?? "-"}</p></div>
        </aside>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="fdv-panel p-5">
          <h3 className="mb-2 text-3xl font-semibold text-fdv-heading">Últimas Mediciones</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-fdv-muted"><tr><th>Día</th><th>Temp</th><th>pH</th><th>°Brix</th></tr></thead>
            <tbody>{metrics.slice(-5).reverse().map((m) => <tr key={m.metric_date} className="border-t border-fdv-line"><td className="py-2">{formatDate(m.metric_date)}</td><td>{m.temperature_c ?? "-"}°C</td><td>{m.ph ?? "-"}</td><td>{m.brix ?? "-"}</td></tr>)}</tbody>
          </table>
        </article>
        <article className="fdv-panel p-5">
          <h3 className="mb-2 text-3xl font-semibold text-fdv-heading">Línea de Eventos</h3>
          <ul className="space-y-2 text-sm text-fdv-muted">{(eventsRes.data ?? []).map((e) => <li key={`${e.started_at}-${e.comments ?? ""}`} className="rounded-lg border border-fdv-line bg-[#fffdfb] px-3 py-2">{new Date(e.started_at).toLocaleDateString("es-MX")}: {e.comments ?? "Cambio de etapa"}</li>)}</ul>
          <div className="mt-4 flex gap-2"><button className="fdv-btn-primary">Nueva Medición</button><button className="fdv-btn-secondary">Registrar Evento</button></div>
        </article>
      </div>
    </section>
  );
}
