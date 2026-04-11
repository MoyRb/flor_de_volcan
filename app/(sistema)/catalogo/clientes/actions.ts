'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';
import { initialActionState, type ActionState } from '@/app/(sistema)/catalogo/_shared/state';
import { clienteSchema } from './schema';

export async function upsertCliente(prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
  void prevState;
  const parsed = clienteSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    client_code: String(formData.get('client_code') ?? '').toUpperCase(),
    legal_name: String(formData.get('legal_name') ?? ''),
    commercial_name: String(formData.get('commercial_name') ?? ''),
    tax_id: String(formData.get('tax_id') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    city: String(formData.get('city') ?? ''),
    state: String(formData.get('state') ?? ''),
    credit_limit: formData.get('credit_limit') ?? 0,
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) return { success: false, message: 'Datos inválidos.', errors: parsed.error.flatten().fieldErrors };
  const { id, ...payload } = parsed.data;
  const supabase = await createClient();
  const { error } = id ? await supabase.from('clients').update(payload).eq('id', id) : await supabase.from('clients').insert(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath('/catalogo/clientes');
  revalidatePath('/clientes');
  return { success: true, message: id ? 'Cliente actualizado.' : 'Cliente creado.' };
}

export async function deleteCliente(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('clients').delete().eq('id', id);
  revalidatePath('/catalogo/clientes');
}
