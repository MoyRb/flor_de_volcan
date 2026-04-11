'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';

import { movementSchema, rawMaterialSchema } from './schema';

export async function upsertRawMaterial(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = rawMaterialSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    code: String(formData.get('code') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    material_type_id: String(formData.get('material_type_id') ?? ''),
    base_unit_id: String(formData.get('base_unit_id') ?? ''),
    min_stock: formData.get('min_stock') ?? 0,
    notes: String(formData.get('notes') ?? ''),
    is_active: formData.get('is_active') === 'on',
  });

  if (!parsed.success) {
    return { success: false, message: 'Revisa la captura.', errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;

  const { error } = id
    ? await supabase.from('raw_materials').update(payload).eq('id', id)
    : await supabase.from('raw_materials').insert({ ...payload, current_stock: 0 });

  if (error) return { success: false, message: error.message };

  revalidatePath('/materia-prima');
  return { success: true, message: id ? 'Materia prima actualizada.' : 'Materia prima creada.' };
}

export async function deactivateRawMaterial(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('raw_materials').update({ is_active: false }).eq('id', id);
  revalidatePath('/materia-prima');
}

export async function createStockMovement(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = movementSchema.safeParse({
    raw_material_id: String(formData.get('raw_material_id') ?? ''),
    movement_type: formData.get('movement_type'),
    quantity: formData.get('quantity'),
    movement_date: String(formData.get('movement_date') ?? ''),
    unit_cost: formData.get('unit_cost') ?? '',
    supplier_id: String(formData.get('supplier_id') ?? ''),
    lot_id: String(formData.get('lot_id') ?? ''),
    reference: String(formData.get('reference') ?? ''),
    notes: String(formData.get('notes') ?? ''),
  });

  if (!parsed.success) {
    return { success: false, message: 'Movimiento inválido.', errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: material } = await supabase
    .from('raw_materials')
    .select('id, current_stock')
    .eq('id', parsed.data.raw_material_id)
    .single();

  if (!material) return { success: false, message: 'Materia prima no encontrada.' };

  const delta = parsed.data.movement_type === 'OUT' ? -parsed.data.quantity : parsed.data.quantity;
  const nextStock = Number(material.current_stock) + delta;

  if (nextStock < 0) {
    return { success: false, message: 'La salida deja stock negativo. Ajusta la cantidad.' };
  }

  const { error: movementError } = await supabase.from('raw_material_stock_movements').insert({
    raw_material_id: parsed.data.raw_material_id,
    movement_type: parsed.data.movement_type,
    quantity: parsed.data.quantity,
    movement_date: parsed.data.movement_date,
    unit_cost: parsed.data.unit_cost === '' ? null : Number(parsed.data.unit_cost),
    supplier_id: parsed.data.supplier_id || null,
    lot_id: parsed.data.lot_id || null,
    reference: parsed.data.reference || null,
    notes: parsed.data.notes || null,
  });

  if (movementError) return { success: false, message: movementError.message };

  const { error: stockError } = await supabase
    .from('raw_materials')
    .update({ current_stock: nextStock })
    .eq('id', parsed.data.raw_material_id);

  if (stockError) return { success: false, message: stockError.message };

  revalidatePath('/materia-prima');
  return { success: true, message: 'Movimiento registrado.' };
}
