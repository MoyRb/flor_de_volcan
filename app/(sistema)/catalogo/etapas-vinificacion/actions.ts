'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { etapaSchema } from './schema';

export async function upsertEtapa(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = etapaSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    code: String(formData.get('code') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    stage_order: formData.get('stage_order'),
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) return { success: false, message: 'Revisa los datos.', errors: parsed.error.flatten().fieldErrors };
  const { id, ...payload } = parsed.data;
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('cat_vinification_stages').update(payload).eq('id', id)
    : await supabase.from('cat_vinification_stages').insert(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath('/catalogo/etapas-vinificacion');
  return { success: true, message: id ? 'Etapa actualizada.' : 'Etapa creada.' };
}

export async function deleteEtapa(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('cat_vinification_stages').delete().eq('id', id);
  revalidatePath('/catalogo/etapas-vinificacion');
}
