'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { parametroSchema } from './schema';

export async function upsertParametro(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = parametroSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    code: String(formData.get('code') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    unit_id: String(formData.get('unit_id') ?? '') || null,
    min_value: formData.get('min_value'),
    max_value: formData.get('max_value'),
    warning_low: formData.get('warning_low'),
    warning_high: formData.get('warning_high'),
    is_required: formData.get('is_required') === 'on',
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) return { success: false, message: 'Validación inválida.', errors: parsed.error.flatten().fieldErrors };
  const { id, ...payload } = parsed.data;
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('process_parameters').update(payload).eq('id', id)
    : await supabase.from('process_parameters').insert(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath('/catalogo/parametros-control');
  revalidatePath('/parametros');
  return { success: true, message: id ? 'Parámetro actualizado.' : 'Parámetro creado.' };
}

export async function deleteParametro(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('process_parameters').delete().eq('id', id);
  revalidatePath('/catalogo/parametros-control');
}
