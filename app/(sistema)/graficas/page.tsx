/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/src/lib/supabase/server';

export default async function GraficasPage() {
  const supabase = await createClient();
  const { data: lot } = await (supabase as any)
    .from('wine_lots')
    .select('id, lot_code')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: metrics } = lot?.id
    ? await (supabase as any).from('lot_daily_metrics').select('metric_date,brix').eq('lot_id', lot.id).order('metric_date', { ascending: true }).limit(14)
    : { data: [] };

  const points = ((metrics ?? []) as Array<{ metric_date: string; brix: number | null }>).map((m) => m.brix ?? 0);
  const maxValue = points.length ? Math.max(...points, 1) : 1;

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Graficación diaria</h1>
      <p className="text-sm text-fdv-muted">Tendencia de Brix por día del lote activo ({lot?.lot_code ?? 'sin lote'}).</p>
      <div className="mt-5 grid grid-cols-7 items-end gap-2 rounded-xl border border-fdv-border bg-white p-4">
        {points.slice(-7).map((value, idx) => (
          <div key={`${value}-${idx}`} className="space-y-2 text-center">
            <div className="mx-auto w-full rounded-md bg-fdv-clay/25" style={{ height: `${(value / maxValue) * 180}px` }}>
              <div className="h-full w-full rounded-md bg-gradient-to-t from-fdv-clay to-fdv-wine" />
            </div>
            <p className="text-xs text-fdv-muted">D{idx + 1}</p>
          </div>
        ))}
        {points.length === 0 && <p className="col-span-7 text-center text-sm text-fdv-muted">Sin mediciones guardadas para graficar.</p>}
      </div>
    </section>
  );
}
