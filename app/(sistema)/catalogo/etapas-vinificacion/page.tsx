import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';
import { deleteEtapa } from './actions';
import { EtapaForm } from './form';

export default async function EtapasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('cat_vinification_stages').select('*').order('stage_order');
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Etapas de vinificación</h1>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-fdv-border bg-white p-3"><EtapaForm /></div>
        <div className="space-y-3">{data?.map((row) => <div key={row.id} className="rounded-xl border border-fdv-border bg-white p-3"><div className="mb-2 flex justify-between"><p>{row.stage_order}. {row.name}</p><form action={deleteEtapa}><input type="hidden" name="id" value={row.id} /><ConfirmSubmitButton label="Eliminar" confirmMessage="¿Eliminar etapa?" className="text-xs text-fdv-error" /></form></div><EtapaForm initial={row} /></div>)}</div>
      </div>
    </section>
  );
}
