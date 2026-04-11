'use client';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { upsertCliente } from './actions';

type Initial = {
  id?: string; client_code: string; legal_name: string; commercial_name: string | null; tax_id: string | null;
  phone: string | null; email: string | null; city: string | null; state: string | null; credit_limit: number; is_active: boolean;
};

export function ClienteForm({ initial }: { initial?: Initial }) {
  const [state, action] = useActionState(upsertCliente, initialActionState);
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ''} />
      <input name="client_code" className="fdv-input" defaultValue={initial?.client_code ?? ''} placeholder="Código" required />
      <input name="legal_name" className="fdv-input" defaultValue={initial?.legal_name ?? ''} placeholder="Razón social" required />
      <input name="commercial_name" className="fdv-input" defaultValue={initial?.commercial_name ?? ''} placeholder="Nombre comercial" />
      <div className="grid grid-cols-2 gap-2"><input name="tax_id" className="fdv-input" defaultValue={initial?.tax_id ?? ''} placeholder="RFC" /><input name="phone" className="fdv-input" defaultValue={initial?.phone ?? ''} placeholder="Teléfono" /></div>
      <input name="email" type="email" className="fdv-input" defaultValue={initial?.email ?? ''} placeholder="Correo" />
      <div className="grid grid-cols-2 gap-2"><input name="city" className="fdv-input" defaultValue={initial?.city ?? ''} placeholder="Ciudad" /><input name="state" className="fdv-input" defaultValue={initial?.state ?? ''} placeholder="Estado" /></div>
      <input name="credit_limit" type="number" min={0} step="0.01" className="fdv-input" defaultValue={initial?.credit_limit ?? 0} />
      <label className="text-xs"><input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} /> Activo</label>
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel={initial ? 'Actualizar' : 'Guardar'} />
    </form>
  );
}
