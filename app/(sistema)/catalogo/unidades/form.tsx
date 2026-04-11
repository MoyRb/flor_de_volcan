'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { upsertUnidad } from './actions';

export function UnidadForm({ initial }: { initial?: { id?: string; code: string; name: string; is_active: boolean } }) {
  const [state, action] = useActionState(upsertUnidad, initialActionState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="code" className="fdv-input" placeholder="Clave" defaultValue={initial?.code ?? ''} required />
      <input name="name" className="fdv-input" placeholder="Nombre" defaultValue={initial?.name ?? ''} required />
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton idleLabel={initial ? 'Actualizar' : 'Guardar'} className="fdv-btn-primary" />
    </form>
  );
}
