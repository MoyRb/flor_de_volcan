'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { upsertParametro } from './actions';

type Unit = { id: string; name: string; code: string };
type Item = {
  id?: string; code: string; name: string; unit_id: string | null; min_value: number | null; max_value: number | null;
  warning_low: number | null; warning_high: number | null; is_required: boolean; is_active: boolean;
};

export function ParametroForm({ units, initial }: { units: Unit[]; initial?: Item }) {
  const [state, action] = useActionState(upsertParametro, initialActionState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="code" className="fdv-input" defaultValue={initial?.code ?? ''} placeholder="Clave" required />
      <input name="name" className="fdv-input" defaultValue={initial?.name ?? ''} placeholder="Nombre" required />
      <select name="unit_id" className="fdv-input" defaultValue={initial?.unit_id ?? ''}><option value="">Sin unidad</option>{units.map((u) => <option key={u.id} value={u.id}>{u.code} - {u.name}</option>)}</select>
      <div className="grid grid-cols-2 gap-2"><input type="number" step="0.0001" name="min_value" placeholder="Mín" className="fdv-input" defaultValue={initial?.min_value ?? ''} /><input type="number" step="0.0001" name="max_value" placeholder="Máx" className="fdv-input" defaultValue={initial?.max_value ?? ''} /></div>
      <div className="grid grid-cols-2 gap-2"><input type="number" step="0.0001" name="warning_low" placeholder="Alerta baja" className="fdv-input" defaultValue={initial?.warning_low ?? ''} /><input type="number" step="0.0001" name="warning_high" placeholder="Alerta alta" className="fdv-input" defaultValue={initial?.warning_high ?? ''} /></div>
      <label className="text-xs"><input type="checkbox" name="is_required" defaultChecked={initial?.is_required ?? false} /> Requerido</label>
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel={initial ? 'Actualizar' : 'Guardar'} />
    </form>
  );
}
