'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';

export async function createLot(formData: FormData) {
  const supabase = await createClient();
  const lot_code = String(formData.get('lot_code') ?? '').trim();
  const start_date = String(formData.get('start_date') ?? '');
  const target_volume_liters = Number(formData.get('liters') ?? 0);
  const notes = String(formData.get('notes') ?? '');
  const fruitId = String(formData.get('fruit_id') ?? '');
  const recipeId = String(formData.get('recipe_id') ?? '');
  const stageId = String(formData.get('stage_id') ?? '');
  const tankId = String(formData.get('tank_id') ?? '');
  const brix = Number(formData.get('brix') ?? 0);
  const ph = Number(formData.get('ph') ?? 0);
  const tempRaw = String(formData.get('temperature_c') ?? '');
  const temperature_c = tempRaw ? Number(tempRaw) : null;
  const yeast = String(formData.get('yeast') ?? '').trim();
  const concentration = String(formData.get('concentration') ?? '').trim();
  const estimatedDays = String(formData.get('estimated_days') ?? '').trim();
  const changeRule = String(formData.get('change_rule') ?? '').trim();

  if (!lot_code || !start_date || target_volume_liters <= 0 || !stageId || !fruitId) return;

  const [{ data: status }, { data: fallbackProduct }, { data: fruit }] = await Promise.all([
    supabase.from('cat_lot_status').select('id').order('is_closed').limit(1).maybeSingle(),
    supabase.from('finished_products').select('id').limit(1).maybeSingle(),
    supabase.from('cat_material_types').select('name').eq('id', fruitId).maybeSingle(),
  ]);
  if (!status?.id || !fallbackProduct?.id) return;

  const finalProductId = recipeId || fallbackProduct.id;
  const metadata = {
    fruit_id: fruitId,
    fruit_name: fruit?.name ?? null,
    recipe_id: recipeId || null,
    yeast: yeast || null,
    concentration: concentration || null,
    target_brix: brix,
    target_ph: ph,
    target_temperature_c: temperature_c,
    estimated_stage_days: estimatedDays || null,
    stage_change_rule: changeRule || null,
    notes: notes || null,
  };

  const { data: lot } = await supabase.from('wine_lots').insert({
    lot_code, start_date, target_volume_liters, current_volume_liters: target_volume_liters, current_stage_id: stageId, lot_status_id: status.id, finished_product_id: finalProductId, notes: JSON.stringify(metadata),
  }).select('id').maybeSingle();

  if (!lot?.id) return;

  await Promise.all([
    supabase.from('lot_stage_history').insert({ lot_id: lot.id, stage_id: stageId, started_at: `${start_date}T00:00:00Z`, comments: 'Etapa inicial del lote' }),
    supabase.from('lot_daily_metrics').upsert({ lot_id: lot.id, metric_date: start_date, brix, ph, temperature_c }, { onConflict: 'lot_id,metric_date' }),
    supabase.from('bitacora_entries').insert({ lot_id: lot.id, entry_type: 'creacion_lote', details: `Lote creado para ${fruit?.name ?? 'fruta'}${recipeId ? ' (ensayo/receta)' : ''}. Brix inicial ${brix}; pH inicial ${ph}.`, tags: ['lote', 'inicio', 'fruta'] }),
    tankId ? supabase.from('capacity_tanks').update({ current_lot_id: lot.id }).eq('id', tankId) : Promise.resolve(),
  ]);

  revalidatePath('/lotes'); revalidatePath('/dashboard'); revalidatePath('/reportes');
}
