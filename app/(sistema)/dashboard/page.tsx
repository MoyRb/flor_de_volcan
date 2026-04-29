import { createClient } from "@/src/lib/supabase/server";

function statusBadge(status: string | null) {
  if (!status) return "fdv-badge fdv-badge-soft";
  return /alerta|desvi/i.test(status) ? "fdv-badge fdv-badge-warn" : "fdv-badge fdv-badge-ok";
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
        supabase.from("lot_daily_metrics").select("metric_date, temperature_c, ph, brix").eq("lot_id", lotId).order("metric_date", { ascending: false }).limit(7),
        supabase.from("lot_stage_history").select("started_at, comments").eq("lot_id", lotId).order("started_at", { ascending: false }).limit(6),
      ])
    : [{ data: [] }, { data: [] }];

  const latest = metricsRes.data?.[0];
  const processDay = (metricsRes.data?.length ?? 0) > 0 ? metricsRes.data!.length : "-";

  return (
    <section className="space-y-5">
      <header className="fdv-panel p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-fdv-muted">Flor del Volcán</p>
        <h1 className="font-brand text-3xl text-fdv-burgundy">Control de Fermentación</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <article className="fdv-stat"><span>Estado lote actual</span><strong className={statusBadge("En seguimiento")}>En seguimiento</strong></article>
          <article className="fdv-stat"><span>Lote actual</span><strong>{lot?.lot_code ?? "Sin lote"}</strong></article>
          <article className="fdv-stat"><span>Día del proceso</span><strong>{String(processDay)}</strong></article>
          <article className="fdv-stat"><span>Litros</span><strong>{lot?.current_volume_liters ?? 0} L</strong></article>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_290px]">
        <article className="fdv-panel p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-fdv-burgundy">Brix vs Días</h2><p className="text-xs text-fdv-muted">Última medición: {latest?.metric_date ?? "N/A"}</p></div>
          <div className="h-56 rounded-2xl border border-fdv-border bg-white p-4">
            <div className="flex h-full items-end gap-2">
              {(metricsRes.data ?? []).slice().reverse().map((m) => (
                <div key={m.metric_date} className="flex-1 text-center">
                  <div className="mx-auto w-full rounded-t-md bg-fdv-clay/75" style={{ height: `${Math.max(8, Number(m.brix ?? 0) * 8)}px` }} />
                  <p className="mt-2 text-[11px] text-fdv-muted">{m.metric_date}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-3">
          <article className="fdv-widget"><p className="text-xs text-fdv-muted">Temperatura</p><p className="text-2xl font-semibold">{latest?.temperature_c ?? "-"} °C</p></article>
          <article className="fdv-widget"><p className="text-xs text-fdv-muted">pH</p><p className="text-2xl font-semibold">{latest?.ph ?? "-"}</p></article>
          <article className="fdv-widget"><p className="text-xs text-fdv-muted">°Brix</p><p className="text-2xl font-semibold">{latest?.brix ?? "-"}</p></article>
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="fdv-panel p-5">
          <h3 className="font-semibold text-fdv-burgundy">Últimas Mediciones</h3>
          <ul className="mt-3 space-y-2 text-sm text-fdv-muted">{(metricsRes.data ?? []).map((m) => <li key={m.metric_date} className="rounded-lg border border-fdv-border bg-white px-3 py-2">{m.metric_date}: Temp {m.temperature_c ?? "-"}°C · pH {m.ph ?? "-"} · Brix {m.brix ?? "-"}</li>)}</ul>
        </article>
        <article className="fdv-panel p-5">
          <h3 className="font-semibold text-fdv-burgundy">Línea de Eventos</h3>
          <ul className="mt-3 space-y-2 text-sm text-fdv-muted">{(eventsRes.data ?? []).map((e) => <li key={`${e.started_at}-${e.comments ?? ""}`} className="rounded-lg border border-fdv-border bg-white px-3 py-2">{e.started_at}: {e.comments ?? "Sin comentario"}</li>)}</ul>
        </article>
      </div>
      <div className="flex gap-3"><button className="fdv-btn-primary">Nueva Medición</button><button className="fdv-btn-secondary">Registrar Evento</button></div>
    </section>
  );
}
