/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import { registerMeasurement } from '../dashboard/actions';

function toInputDateTime(dateValue?: string) {
  if (!dateValue) return new Date().toISOString().slice(0, 16);
  const date = new Date(dateValue);
  const iso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  return iso.slice(0, 16);
}

export default async function RegistroMedicionesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: lots } = await (supabase as any)
    .from('wine_lots')
    .select('id, lot_code, start_date, cat_lot_status(name)')
    .order('start_date', { ascending: false })
    .limit(30);

  const selectedLot = typeof params.lot === 'string'
    ? params.lot
    : (lots?.[0]?.id ?? '');

  const [metricsRes, eventsRes] = selectedLot
    ? await Promise.all([
        (supabase as any)
          .from('lot_daily_metrics')
          .select('metric_date, brix, ph, temperature_c')
          .eq('lot_id', selectedLot)
          .order('metric_date', { ascending: true })
          .limit(12),
        (supabase as any)
          .from('bitacora_entries')
          .select('entry_date, entry_type, details')
          .eq('lot_id', selectedLot)
          .order('entry_date', { ascending: true })
          .limit(12),
      ])
    : [{ data: [] }, { data: [] }];

  const metricas = (metricsRes.data ?? []) as Array<{ metric_date: string; brix: number | null; ph: number | null; temperature_c: number | null }>;
  const eventos = (eventsRes.data ?? []) as Array<{ entry_date: string; entry_type: string; details: string }>;

  return <section className="space-y-4">
    <header className="fdv-panel p-5">
      <h1 className="text-2xl font-semibold text-fdv-heading">Registro de Mediciones</h1>
      <p className="text-sm text-fdv-muted">Captura mediciones reales del fermento y agrégalas al seguimiento del lote en curso.</p>
    </header>

    <article className="fdv-panel p-5">
      <form action={registerMeasurement} className="grid gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Lote</label>
          <select name="lot_id" defaultValue={selectedLot} required className="fdv-input">
            <option value="" disabled>Selecciona un lote</option>
            {(lots ?? []).map((lot: { id: string; lot_code: string; cat_lot_status?: { name?: string } | null }) => (
              <option key={lot.id} value={lot.id}>{lot.lot_code} · {(lot.cat_lot_status as { name?: string } | null)?.name ?? 'Sin estado'}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha</label>
            <input type="datetime-local" name="reading_at" required defaultValue={toInputDateTime()} className="fdv-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Observaciones</label>
            <input name="note" placeholder="Opcional" className="fdv-input" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div><label className="mb-1 block text-sm font-medium">Brix</label><input name="brix" type="number" step="0.01" className="fdv-input" /></div>
          <div><label className="mb-1 block text-sm font-medium">pH</label><input name="ph" type="number" step="0.01" className="fdv-input" /></div>
          <div><label className="mb-1 block text-sm font-medium">Temp (°C)</label><input name="temperature_c" type="number" step="0.1" className="fdv-input" /></div>
        </div>

        <div className="flex gap-2">
          <button className="fdv-btn-primary">Guardar medición</button>
          {selectedLot && <Link href={`/reportes?lot=${selectedLot}`} className="fdv-btn-secondary">Ver detalle del lote</Link>}
        </div>
      </form>
    </article>

    <div className="grid gap-4 lg:grid-cols-2">
      <article className="fdv-panel p-5">
        <h2 className="font-semibold">Últimas mediciones reales</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {metricas.slice(-12).reverse().map((m) => <li key={m.metric_date}>{new Date(m.metric_date).toLocaleDateString('es-MX')}: Brix {m.brix ?? '-'} · pH {m.ph ?? '-'} · Temp {m.temperature_c ?? '-'}°C</li>)}
          {metricas.length === 0 && <li className="text-fdv-muted">Sin mediciones registradas.</li>}
        </ul>
      </article>
      <article className="fdv-panel p-5">
        <h2 className="font-semibold">Seguimiento del lote (orden cronológico)</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {eventos.map((e) => <li key={`${e.entry_date}-${e.details}`}>{e.entry_date} · [{e.entry_type}] {e.details}</li>)}
          {eventos.length === 0 && <li className="text-fdv-muted">Sin eventos registrados.</li>}
        </ul>
      </article>
    </div>
  </section>;
}
