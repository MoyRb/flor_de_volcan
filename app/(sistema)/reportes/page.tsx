import { createClient } from '@/src/lib/supabase/server';

export default async function ReportesPage({ searchParams }: { searchParams: Promise<{ lot?: string; from?: string; to?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const { data: lots } = await supabase.from('wine_lots').select('id, lot_code, start_date, current_volume_liters, cat_vinification_stages(name)').order('start_date', { ascending: false });
  const selectedLot = params.lot ?? lots?.[0]?.id;

  const metricsQ = supabase.from('lot_daily_metrics').select('metric_date, brix, ph, temperature_c').eq('lot_id', selectedLot ?? '').order('metric_date', { ascending: false });
  const eventsQ = supabase.from('bitacora_entries').select('entry_date, entry_type, details').eq('lot_id', selectedLot ?? '').order('entry_date', { ascending: false });

  if (params.from) {
    metricsQ.gte('metric_date', params.from);
    eventsQ.gte('entry_date', `${params.from}T00:00:00`);
  }
  if (params.to) {
    metricsQ.lte('metric_date', params.to);
    eventsQ.lte('entry_date', `${params.to}T23:59:59`);
  }

  const [{ data: metrics }, { data: events }] = await Promise.all([metricsQ, eventsQ]);

  return <section className="space-y-4">
    <header className="fdv-panel p-6"><h1 className="font-brand text-2xl text-fdv-burgundy">Reportes por lote</h1></header>
    <form className="fdv-panel grid gap-3 p-4 md:grid-cols-4" method="get">
      <select name="lot" defaultValue={selectedLot} className="fdv-input">{(lots ?? []).map((l) => <option key={l.id} value={l.id}>{l.lot_code}</option>)}</select>
      <input type="date" name="from" defaultValue={params.from} className="fdv-input" />
      <input type="date" name="to" defaultValue={params.to} className="fdv-input" />
      <button className="fdv-btn-primary">Filtrar</button>
    </form>
    <article className="fdv-panel p-4">
      <h2 className="font-semibold">Historial de mediciones</h2>
      <ul className="text-sm">{(metrics ?? []).map((m) => <li key={m.metric_date}>{m.metric_date}: Brix {m.brix ?? '-'} · pH {m.ph ?? '-'} · Temp {m.temperature_c ?? '-'}°C</li>)}</ul>
      <h2 className="mt-4 font-semibold">Historial de eventos</h2>
      <ul className="text-sm">{(events ?? []).map((e) => <li key={`${e.entry_date}-${e.details}`}>{new Date(e.entry_date).toLocaleString('es-MX')} [{e.entry_type}] {e.details}</li>)}</ul>
    </article>
  </section>;
}
