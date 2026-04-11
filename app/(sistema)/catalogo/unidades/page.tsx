import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';
import { deleteUnidad } from './actions';
import { UnidadForm } from './form';

export default async function UnidadesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('cat_units').select('*').order('name');
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Unidades de medida</h1>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-fdv-border bg-white p-3"><UnidadForm /></div>
        <div className="space-y-3">{data?.map((row) => <div key={row.id} className="rounded-xl border border-fdv-border bg-white p-3"><div className="mb-2 flex justify-between"><p>{row.code} · {row.name}</p><form action={deleteUnidad}><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton label="Eliminar" confirmMessage="¿Eliminar unidad?" className="text-xs text-fdv-error" /></form></div><UnidadForm initial={row} /></div>)}</div>
      </div>
    </section>
  );
}
