'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { upsertEtapa } from './actions';

export function EtapaForm({ initial }: { initial?: { id?: string; code: string; name: string; stage_order: number; is_active: boolean } }) {
  const [state, action] = useActionState(upsertEtapa, initialActionState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="code" className="fdv-input" defaultValue={initial?.code ?? ''} placeholder="Clave" required />
      <input name="name" className="fdv-input" defaultValue={initial?.name ?? ''} placeholder="Nombre" required />
      <input name="stage_order" type="number" min={1} className="fdv-input" defaultValue={initial?.stage_order ?? 1} required />
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activa</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton idleLabel={initial ? 'Actualizar' : 'Guardar'} className="fdv-btn-primary" />
    </form>
  );
}
