'use client';

import { useActionState } from 'react';

import { SubmitButton } from '@/components/submit-button';
import { initialActionState } from '@/app/(sistema)/catalogo/_shared/state';

import { createStockMovement } from './actions';

type Option = { id: string; label: string };

export function MovementForm({ materials, suppliers, lots }: { materials: Option[]; suppliers: Option[]; lots: Option[] }) {
  const [state, action] = useActionState(createStockMovement, initialActionState);

  return (
    <form action={action} className="grid gap-2 rounded-xl border border-fdv-border bg-white p-3">
      <h3 className="font-semibold">Nuevo movimiento</h3>
      <select name="raw_material_id" className="fdv-input" required>
        <option value="">Materia prima</option>
        {materials.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <select name="movement_type" className="fdv-input" defaultValue="IN" required>
          <option value="IN">Entrada</option>
          <option value="OUT">Salida</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
        <input name="quantity" type="number" min={0.001} step="0.001" className="fdv-input" placeholder="Cantidad" required />
      </div>
      <input name="movement_date" type="datetime-local" className="fdv-input" defaultValue={new Date().toISOString().slice(0, 16)} required />
      <input name="unit_cost" type="number" min={0} step="0.01" className="fdv-input" placeholder="Costo unitario" />
      <select name="supplier_id" className="fdv-input"><option value="">Proveedor</option>{suppliers.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      <select name="lot_id" className="fdv-input"><option value="">Lote relacionado</option>{lots.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      <input name="reference" className="fdv-input" placeholder="Referencia" />
      <textarea name="notes" rows={2} className="fdv-input" placeholder="Notas" />
      {state.message ? <p className={`text-xs ${state.success ? 'text-fdv-olive' : 'text-fdv-error'}`}>{state.message}</p> : null}
      <SubmitButton className="fdv-btn-primary" idleLabel="Registrar movimiento" />
    </form>
  );
}
