import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';

import { deleteFruta } from './actions';
import { FrutaForm } from './form';

export default async function FrutasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('cat_material_types').select('*').order('name');

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Frutas</h1>
      <p className="text-sm text-fdv-muted">Catálogo almacenado en cat_material_types.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <FrutaForm />
        <div className="space-y-3">
          {data?.map((item) => (
            <div key={item.id} className="rounded-xl border border-fdv-border bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{item.name}</p>
                <form action={deleteFruta}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmitButton className="text-xs text-fdv-error" label="Eliminar" confirmMessage="¿Eliminar fruta?" />
                </form>
              </div>
              <FrutaForm initial={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
