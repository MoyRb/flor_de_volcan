'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { unidadSchema } from './schema';

export async function upsertUnidad(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = unidadSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    code: String(formData.get('code') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) return { success: false, message: 'Datos inválidos.', errors: parsed.error.flatten().fieldErrors };
  const { id, ...payload } = parsed.data;
  const supabase = await createClient();
  const { error } = id ? await supabase.from('cat_units').update(payload).eq('id', id) : await supabase.from('cat_units').insert(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath('/catalogo/unidades');
  return { success: true, message: id ? 'Unidad actualizada.' : 'Unidad creada.' };
}

export async function deleteUnidad(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('cat_units').delete().eq('id', id);
  revalidatePath('/catalogo/unidades');
}
