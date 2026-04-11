'use client';

import { useActionState } from 'react';

import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';

import { upsertFruta } from './actions';

type Props = {
  initial?: { id?: string; code: string; name: string; is_active: boolean };
};

export function FrutaForm({ initial }: Props) {
  const [state, action] = useActionState(upsertFruta, initialActionState);

  return (
    <form action={action} className="grid gap-2 rounded-xl border border-fdv-border bg-white p-3">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="code" placeholder="Clave" defaultValue={initial?.code ?? ''} className="fdv-input" required />
      <input name="name" placeholder="Nombre" defaultValue={initial?.name ?? ''} className="fdv-input" required />
      <label className="flex items-center gap-2 text-xs text-fdv-muted">
        <input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo
      </label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel={initial ? 'Actualizar' : 'Guardar'} />
    </form>
  );
}
