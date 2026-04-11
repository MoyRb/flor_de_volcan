import { ConfirmSubmitButton } from '@/components/confirm-submit-button';
import { createClient } from '@/src/lib/supabase/server';

import { deactivateRawMaterial } from './actions';
import { MovementForm } from './movement-form';
import { RawMaterialForm } from './form';

export default async function MateriaPrimaPage() {
  const supabase = await createClient();
  const [{ data: materials }, { data: types }, { data: units }, { data: suppliers }, { data: lots }, { data: movements }] = await Promise.all([
    supabase.from('raw_materials').select('*').order('name'),
    supabase.from('cat_material_types').select('id, code, name').order('name'),
    supabase.from('cat_units').select('id, code, name').order('name'),
    supabase.from('suppliers').select('id, supplier_code, name').eq('is_active', true).order('name'),
    supabase.from('wine_lots').select('id, lot_code').order('lot_code'),
    supabase.from('raw_material_stock_movements').select('id, movement_type, quantity, movement_date, reference, raw_materials(name)').order('movement_date', { ascending: false }).limit(20),
  ]);

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Materia prima</h1>
      <p className="text-sm text-fdv-muted">CRUD operativo e inventario con persistencia en Supabase.</p>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <RawMaterialForm types={types ?? []} units={units ?? []} />
        <MovementForm
          materials={(materials ?? []).map((item) => ({ id: item.id, label: `${item.code} · ${item.name}` }))}
          suppliers={(suppliers ?? []).map((item) => ({ id: item.id, label: `${item.supplier_code} · ${item.name}` }))}
          lots={(lots ?? []).map((item) => ({ id: item.id, label: item.lot_code }))}
        />
        <div className="rounded-xl border border-fdv-border bg-white p-3">
          <h3 className="mb-2 font-semibold">Movimientos recientes</h3>
          <div className="space-y-2 text-xs">
            {movements?.map((row) => (
              <div key={row.id} className="rounded border border-fdv-border p-2">
                <p className="font-medium">{row.raw_materials?.name ?? 'Material'}</p>
                <p>{row.movement_type} · {row.quantity}</p>
                <p className="text-fdv-muted">{new Date(row.movement_date).toLocaleString('es-MX')} {row.reference ? `· ${row.reference}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {(materials ?? []).map((item) => (
          <div key={item.id} className="rounded-xl border border-fdv-border bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">{item.code} · {item.name} <span className="text-xs text-fdv-muted">Stock: {item.current_stock}</span></p>
              <form action={deactivateRawMaterial}>
                <input type="hidden" name="id" value={item.id} />
                <ConfirmSubmitButton className="text-xs text-fdv-error" label="Desactivar" confirmMessage="¿Desactivar materia prima?" />
              </form>
            </div>
            <RawMaterialForm initial={item} types={types ?? []} units={units ?? []} />
          </div>
        ))}
      </div>
    </section>
  );
}
