'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { upsertTipoVino } from './actions';

type Unit = { id: string; code: string; name: string };

type Initial = { id?: string; sku: string; name: string; presentation: string | null; is_active: boolean; base_unit_id?: string };

export function TipoVinoForm({ units, initial }: { units: Unit[]; initial?: Initial }) {
  const [state, action] = useActionState(upsertTipoVino, initialActionState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="sku" className="fdv-input" defaultValue={initial?.sku ?? ''} placeholder="SKU" required />
      <input name="name" className="fdv-input" defaultValue={initial?.name ?? ''} placeholder="Nombre" required />
      <input name="presentation" className="fdv-input" defaultValue={initial?.presentation ?? ''} placeholder="Presentación" />
      {!initial?.id ? <select name="base_unit_id" className="fdv-input" defaultValue={initial?.base_unit_id ?? units[0]?.id}><option value="">Unidad base</option>{units.map((u) => <option key={u.id} value={u.id}>{u.code} - {u.name}</option>)}</select> : null}
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel={initial ? 'Actualizar' : 'Guardar'} />
    </form>
  );
}
