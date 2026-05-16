/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/src/lib/supabase/server";
import { registerEvent, registerMeasurement } from "./actions";

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getLotMeta(notes: string | null) {
  if (!notes) return null;
  try { return JSON.parse(notes) as { fruit_name?: string; inoculo_utilizado?: string; protocolo_proceso?: string; relacion_materia_prima_gl?: number; criterio_transicion?: string; sistema_fermentacion?: string; estado_lote?: string; temperatura_inoculacion_c?: number }; } catch { return null; }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: lot } = await (supabase as any)
    .from("wine_lots")
    .select("id, lot_code, start_date, current_volume_liters, notes, cat_vinification_stages(name), cat_lot_status(name)")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lotId = lot?.id;
  const [metricsRes, eventsRes] = lotId
    ? await Promise.all([
      (supabase as any).from("lot_daily_metrics").select("metric_date, temperature_c, ph, brix, color, aroma, sabor").eq("lot_id", lotId).order("metric_date"),
      (supabase as any).from("bitacora_entries").select("entry_date, entry_type, details").eq("lot_id", lotId).order("entry_date", { ascending: true }).limit(24),
    ])
    : [{ data: [] }, { data: [] }];

  const metrics: Array<{ metric_date: string; temperature_c: number | null; ph: number | null; brix: number | null; color: string | null; aroma: string | null; sabor: string | null }> = (metricsRes.data ?? []) as any[];
  const latest = metrics.at(-1);
  const processDay = metrics.length > 0 ? metrics.length : "-";
  const meta = getLotMeta(lot?.notes ?? null);
  const events = (eventsRes.data ?? []) as Array<{ entry_date: string; entry_type: string; details: string }>;

  return <section className="space-y-5">
    <header className="fdv-panel fdv-volcan-bg px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-fdv-muted">Panel operativo de fermentación</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-fdv-heading">Lote activo · {lot?.lot_code ?? "Sin lote activo"}</h1>
          <p className="mt-2 text-sm text-fdv-muted">Día {processDay} · {lot?.current_volume_liters ?? 0} L · Última medición {formatDateTime(latest?.metric_date)}</p>
        </div>
        <span className="rounded-full border border-fdv-line bg-[#f8efe2] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-fdv-heading">Operación en curso</span>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-fdv-muted sm:grid-cols-2">
        <p><span className="font-medium text-fdv-heading">Materia prima:</span> {meta?.fruit_name ?? "No definida"}</p>
        <p><span className="font-medium text-fdv-heading">Protocolo:</span> {meta?.protocolo_proceso ?? "N/A"}</p>
        <p><span className="font-medium text-fdv-heading">Sistema:</span> {meta?.sistema_fermentacion ?? "N/A"}</p>
        <p><span className="font-medium text-fdv-heading">Estado:</span> {meta?.estado_lote ?? (lot?.cat_lot_status as { name?: string } | null)?.name ?? "N/A"}</p>
        <p><span className="font-medium text-fdv-heading">Temp. inoculación:</span> {meta?.temperatura_inoculacion_c ?? "-"} °C</p>
        <p><span className="font-medium text-fdv-heading">Relación MP/Vol:</span> {meta?.relacion_materia_prima_gl ?? "-"} g/L · {meta?.criterio_transicion ?? "-"}</p>
      </div>
    </header>

    <article className="fdv-panel p-5">
      <h2 className="text-lg font-semibold text-fdv-heading">Tendencia de Brix (datos guardados)</h2>
      <svg viewBox="0 0 100 36" className="mt-3 h-52 w-full rounded-2xl border border-fdv-line bg-[#fffcfa]" preserveAspectRatio="none">
        {metrics.length > 1 && <polyline fill="none" stroke="#a8614f" strokeWidth="0.9" points={metrics.map((m, i) => `${(i / (metrics.length - 1)) * 100},${34 - Number(m.brix ?? 0)}`).join(" ")} />}
      </svg>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">Temp: {latest?.temperature_c ?? "-"} °C</div>
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">pH: {latest?.ph ?? "-"}</div>
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">Brix: {latest?.brix ?? "-"}</div>
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">Color: {latest?.color ?? "-"}</div>
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">Aroma: {latest?.aroma ?? "-"}</div>
        <div className="rounded-2xl border border-fdv-line bg-[#fffcf9] p-3">Sabor: {latest?.sabor ?? "-"}</div>
      </div>
    </article>

    <div className="grid gap-4 lg:grid-cols-2">
      <article className="fdv-panel p-5">
        <h3 className="font-semibold text-fdv-heading">Últimas mediciones reales</h3>
        <ul className="mt-2 space-y-1 text-sm">{metrics.slice(-6).reverse().map((m) => <li key={m.metric_date}>{formatDateTime(m.metric_date)} · Brix {m.brix ?? "-"} · pH {m.ph ?? "-"} · Temp {m.temperature_c ?? "-"}°C · Color {m.color ?? "-"} · Aroma {m.aroma ?? "-"} · Sabor {m.sabor ?? "-"}</li>)}</ul>
        {lotId && <form action={registerMeasurement} className="mt-4 grid gap-2">
          <input type="hidden" name="lot_id" value={lotId} />
          <input type="datetime-local" name="reading_at" required className="fdv-input" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><input name="brix" type="number" step="0.01" placeholder="Brix" className="fdv-input" /><input name="ph" type="number" step="0.01" placeholder="pH" className="fdv-input" /><input name="temperature_c" type="number" step="0.1" placeholder="°C" className="fdv-input" /></div>
          <input name="observations" placeholder="Observaciones" className="fdv-input" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select name="color" className="fdv-input"><option value="">Color (opcional)</option><option>Rojo oscuro</option><option>Rojo claro</option><option>Violeta</option><option>Rubí</option><option>Granate</option><option>Otro</option></select>
            <select name="aroma" className="fdv-input"><option value="">Aroma (opcional)</option><option>Frutal</option><option>Floral</option><option>Fermentativo</option><option>Especiado</option><option>Alcoholico</option><option>Ácido</option><option>Otro</option></select>
            <select name="sabor" className="fdv-input"><option value="">Sabor (opcional)</option><option>Dulce</option><option>Seco</option><option>Ácido</option><option>Amargo</option><option>Astringente</option><option>Equilibrado</option><option>Otro</option></select>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input name="color_custom" placeholder="Color libre" className="fdv-input" />
            <input name="aroma_custom" placeholder="Aroma libre" className="fdv-input" />
            <input name="sabor_custom" placeholder="Sabor libre" className="fdv-input" />
          </div>
          <button className="fdv-btn-primary">Nueva medición</button>
        </form>}
      </article>

      <article className="fdv-panel p-5">
        <h3 className="font-semibold text-fdv-heading">Seguimiento del lote (orden cronológico)</h3>
        <ul className="mt-2 space-y-1 text-sm">{events.map((e) => <li key={`${e.entry_date}-${e.details}`}>{formatDateTime(e.entry_date)} · [{e.entry_type}] {e.details}</li>)}</ul>
        {lotId && <form action={registerEvent} className="mt-4 grid gap-2">
          <input type="hidden" name="lot_id" value={lotId} />
          <select name="event_type" className="fdv-input"><option value="inoculacion">Inoculación</option><option value="medicion">Medición</option><option value="trasiego">Trasiego</option><option value="ajuste_ph">Ajuste pH</option><option value="cambio_recipiente">Cambio de recipiente</option><option value="estabilizacion">Estabilización</option><option value="embotellado">Embotellado</option><option value="observacion">Observación</option></select>
          <input type="datetime-local" name="event_date" className="fdv-input" />
          <input name="details" required placeholder="Detalle del evento" className="fdv-input" />
          <button className="fdv-btn-secondary">Registrar evento</button>
        </form>}
      </article>
    </div>
  </section>;
}
