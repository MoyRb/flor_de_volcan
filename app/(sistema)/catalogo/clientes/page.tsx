import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';
import { ClienteForm } from './form';
import { deleteCliente } from './actions';

export default async function CatalogoClientesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('clients').select('*').order('legal_name');

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Clientes</h1>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-fdv-border bg-white p-3"><ClienteForm /></div>
        <div className="space-y-3">{data?.map((row) => <div key={row.id} className="rounded-xl border border-fdv-border bg-white p-3"><div className="mb-2 flex justify-between"><p>{row.client_code} · {row.legal_name}</p><form action={deleteCliente}><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton className="text-xs text-fdv-error" label="Eliminar" confirmMessage="¿Eliminar cliente?" /></form></div><ClienteForm initial={row} /></div>)}</div>
      </div>
    </section>
  );
}
