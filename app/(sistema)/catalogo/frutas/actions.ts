'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';

import { frutaSchema } from './schema';

function toPayload(formData: FormData) {
  return {
    id: String(formData.get('id') ?? '') || undefined,
    code: String(formData.get('code') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    is_active: formData.get('is_active') === 'on',
  };
}

export async function upsertFruta(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = frutaSchema.safeParse(toPayload(formData));
  if (!parsed.success) {
    return { success: false, message: 'Corrige los campos marcados.', errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { id, ...input } = parsed.data;

  const query = id
    ? supabase.from('cat_material_types').update(input).eq('id', id)
    : supabase.from('cat_material_types').insert(input);

  const { error } = await query;
  if (error) {
    return { success: false, message: `No se pudo guardar: ${error.message}` };
  }

  revalidatePath('/catalogo/frutas');
  revalidatePath('/catalogo');
  return { success: true, message: id ? 'Fruta actualizada.' : 'Fruta creada.' };
}

export async function deleteFruta(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('cat_material_types').delete().eq('id', id);
  revalidatePath('/catalogo/frutas');
  revalidatePath('/catalogo');
}
