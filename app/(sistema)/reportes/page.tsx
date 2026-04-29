import { createClient } from '@/src/lib/supabase/server';

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: lots } = await supabase.from('wine_lots').select('lot_code,start_date').order('start_date', { ascending: false }).limit(10);

  return (
    <section className="space-y-4">
      <header className="fdv-panel p-6"><h1 className="font-brand text-2xl text-fdv-burgundy">Reportes</h1><p className="text-sm text-fdv-muted">Consulta por lote, mediciones por fecha y resumen histórico.</p></header>
      <article className="fdv-panel p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="fdv-input"><option>Selecciona lote</option>{(lots ?? []).map((l) => <option key={l.lot_code}>{l.lot_code}</option>)}</select>
          <input type="date" className="fdv-input" />
          <input type="date" className="fdv-input" />
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-fdv-border bg-white p-4 text-sm text-fdv-muted">Estructura lista para exportación / impresión del historial del lote.</div>
      </article>
    </section>
  );
}
