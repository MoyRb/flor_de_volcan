'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { tipoVinoSchema } from './schema';

export async function upsertTipoVino(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = tipoVinoSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    sku: String(formData.get('sku') ?? '').toUpperCase(),
    name: String(formData.get('name') ?? ''),
    presentation: String(formData.get('presentation') ?? ''),
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) return { success: false, message: 'Datos inválidos.', errors: parsed.error.flatten().fieldErrors };
  const { id, ...payload } = parsed.data;
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('finished_products').update(payload).eq('id', id)
    : await supabase.from('finished_products').insert({ ...payload, base_unit_id: String(formData.get('base_unit_id') ?? ''), unit_cost: 0, sale_price: 0, current_stock: 0 });
  if (error) return { success: false, message: error.message };
  revalidatePath('/catalogo/tipos-vino');
  revalidatePath('/producto-terminado');
  return { success: true, message: id ? 'Tipo de vino actualizado.' : 'Tipo de vino creado.' };
}

export async function deleteTipoVino(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('finished_products').delete().eq('id', id);
  revalidatePath('/catalogo/tipos-vino');
}
