'use client';

import { useActionState } from 'react';

import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';

import { upsertRawMaterial } from './actions';

type Option = { id: string; name: string; code: string };
type Initial = {
  id?: string;
  code: string;
  name: string;
  material_type_id: string;
  base_unit_id: string;
  min_stock: number;
  notes: string | null;
  is_active: boolean;
};

export function RawMaterialForm({ initial, types, units }: { initial?: Initial; types: Option[]; units: Option[] }) {
  const [state, action] = useActionState(upsertRawMaterial, initialActionState);

  return (
    <form action={action} className="grid gap-2 rounded-xl border border-fdv-border bg-white p-3">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="code" className="fdv-input" defaultValue={initial?.code ?? ''} placeholder="Clave" required />
      <input name="name" className="fdv-input" defaultValue={initial?.name ?? ''} placeholder="Nombre" required />
      <select name="material_type_id" className="fdv-input" defaultValue={initial?.material_type_id ?? ''} required>
        <option value="">Tipo</option>
        {types.map((item) => (
          <option key={item.id} value={item.id}>{item.code} - {item.name}</option>
        ))}
      </select>
      <select name="base_unit_id" className="fdv-input" defaultValue={initial?.base_unit_id ?? ''} required>
        <option value="">Unidad</option>
        {units.map((item) => (
          <option key={item.id} value={item.id}>{item.code} - {item.name}</option>
        ))}
      </select>
      <input name="min_stock" type="number" min={0} step="0.001" className="fdv-input" defaultValue={initial?.min_stock ?? 0} />
      <textarea name="notes" className="fdv-input" defaultValue={initial?.notes ?? ''} placeholder="Notas" rows={2} />
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel={initial ? 'Actualizar' : 'Guardar'} />
    </form>
  );
}
