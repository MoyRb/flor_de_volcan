import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';
import { deleteTipoVino } from './actions';
import { TipoVinoForm } from './form';

export default async function TiposVinoPage() {
  const supabase = await createClient();
  const [{ data: data }, { data: units }] = await Promise.all([
    supabase.from('finished_products').select('id, sku, name, presentation, is_active, base_unit_id').order('name'),
    supabase.from('cat_units').select('id, code, name').order('name'),
  ]);

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Tipos de vino</h1>
      <p className="text-sm text-fdv-muted">Administra los tipos comerciales (tabla finished_products).</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-fdv-border bg-white p-3"><TipoVinoForm units={units ?? []} /></div>
        <div className="space-y-3">{data?.map((row) => <div key={row.id} className="rounded-xl border border-fdv-border bg-white p-3"><div className="mb-2 flex justify-between"><p>{row.sku} · {row.name}</p><form action={deleteTipoVino}><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton className="text-xs text-fdv-error" label="Eliminar" confirmMessage="¿Eliminar tipo de vino?" /></form></div><TipoVinoForm units={units ?? []} initial={row} /></div>)}</div>
      </div>
    </section>
  );
}
