import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';
import { deleteParametro } from './actions';
import { ParametroForm } from './form';

export default async function ParametrosControlPage() {
  const supabase = await createClient();
  const [{ data: parametros }, { data: units }] = await Promise.all([
    supabase.from('process_parameters').select('*').order('name'),
    supabase.from('cat_units').select('id, code, name').order('name'),
  ]);

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Parámetros de control</h1>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-fdv-border bg-white p-3"><ParametroForm units={units ?? []} /></div>
        <div className="space-y-3">{parametros?.map((row) => <div key={row.id} className="rounded-xl border border-fdv-border bg-white p-3"><div className="mb-2 flex justify-between"><p>{row.code} · {row.name}</p><form action={deleteParametro}><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton className="text-xs text-fdv-error" label="Eliminar" confirmMessage="¿Eliminar parámetro?" /></form></div><ParametroForm units={units ?? []} initial={row} /></div>)}</div>
      </div>
    </section>
  );
}
