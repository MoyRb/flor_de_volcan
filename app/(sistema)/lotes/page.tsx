import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';

function fruitFromNotes(notes: string | null) {
  try { return notes ? (JSON.parse(notes) as { fruit_name?: string }).fruit_name : null; } catch { return null; }
}

export default async function LotesPage() {
  const supabase = await createClient();
  const [{ data: lots }, { data: tanks }] = await Promise.all([
    supabase
      .from('wine_lots')
      .select('id, lot_code, start_date, current_volume_liters, notes, cat_vinification_stages(name), lot_daily_metrics(metric_date,brix)')
      .order('start_date', { ascending: false }),
    supabase.from('capacity_tanks').select('current_lot_id,name'),
  ]);

  const tankByLot = new Map((tanks ?? []).filter((t) => t.current_lot_id).map((t) => [t.current_lot_id as string, t.name]));

  return (
    <section className="fdv-panel p-6">
      <div className="mb-4 flex items-center justify-between"><h1 className="font-brand text-2xl text-fdv-burgundy">Lotes</h1><Link href="/lotes/nuevo" className="fdv-btn-primary">Nuevo Lote</Link></div>
      <table className="w-full text-sm"><thead><tr><th>Lote</th><th>Fruta</th><th>Etapa</th><th>Inicio</th><th>Última medición</th><th>Recipiente</th><th></th></tr></thead><tbody>
        {(lots ?? []).map((lot) => {
          const readings = ((lot as unknown as { lot_daily_metrics?: { metric_date: string; brix: number | null }[] }).lot_daily_metrics ?? []);
          const last = readings.sort((a, b) => b.metric_date.localeCompare(a.metric_date))[0];
          return <tr key={lot.id} className="border-t"><td>{lot.lot_code}</td><td>{fruitFromNotes(lot.notes) ?? '-'}</td><td>{(lot.cat_vinification_stages as { name?: string } | null)?.name ?? '-'}</td><td>{lot.start_date}</td><td>{last ? `${last.metric_date} (Brix ${last.brix ?? '-'})` : '-'}</td><td>{tankByLot.get(lot.id) ?? '-'}</td><td><Link href={`/reportes?lot=${lot.id}`} className="fdv-btn-secondary">Abrir detalle</Link></td></tr>;
        })}
      </tbody></table>
    </section>
  );
}
