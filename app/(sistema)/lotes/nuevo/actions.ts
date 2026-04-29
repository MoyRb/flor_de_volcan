'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';

export async function createLot(formData: FormData) {
  const supabase = await createClient();

  const lot_code = String(formData.get('lot_code') ?? '').trim();
  const start_date = String(formData.get('start_date') ?? '');
  const target_volume_liters = Number(formData.get('liters') ?? 0);
  const notes = String(formData.get('notes') ?? '');

  if (!lot_code || !start_date || target_volume_liters <= 0) return;

  const [{ data: stage }, { data: status }, { data: product }] = await Promise.all([
    supabase.from('cat_vinification_stages').select('id').order('stage_order').limit(1).maybeSingle(),
    supabase.from('cat_lot_status').select('id').limit(1).maybeSingle(),
    supabase.from('finished_products').select('id').limit(1).maybeSingle(),
  ]);

  if (!stage?.id || !status?.id || !product?.id) return;

  await supabase.from('wine_lots').insert({
    lot_code,
    start_date,
    target_volume_liters,
    current_volume_liters: target_volume_liters,
    current_stage_id: stage.id,
    lot_status_id: status.id,
    finished_product_id: product.id,
    notes,
  });

  revalidatePath('/lotes');
  revalidatePath('/dashboard');
}
