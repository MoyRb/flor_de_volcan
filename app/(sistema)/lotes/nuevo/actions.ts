/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';

export async function createLot(formData: FormData) {
  const supabase = await createClient();
  const lot_code = String(formData.get('lot_code') ?? '').trim();
  const start_date = String(formData.get('start_date') ?? '');
  const target_volume_liters = Number(formData.get('liters') ?? 0);
  const notes = String(formData.get('notes') ?? '');
  const materiaPrimaBase = String(formData.get('base_material') ?? '').trim();
  const protocoloProceso = String(formData.get('protocolo_proceso') ?? '').trim();
  const estadoLote = String(formData.get('estado_lote') ?? '').trim();
  const sistemaFermentacion = String(formData.get('sistema_fermentacion') ?? '').trim();
  const brix = Number(formData.get('brix') ?? 0);
  const ph = Number(formData.get('ph') ?? 0);
  const tempRaw = String(formData.get('temperature_c') ?? '');
  const temperature_c = tempRaw ? Number(tempRaw) : null;
  const inoculoUtilizado = String(formData.get('inoculo_utilizado') ?? '').trim();
  const inoculoDosisGlRaw = String(formData.get('inoculo_dosis_gl') ?? '').trim();
  const relacionMateriaPrimaGlRaw = String(formData.get('relacion_materia_prima_gl') ?? '').trim();
  const condicionEsperadaTransicion = String(formData.get('condicion_esperada_transicion') ?? '').trim();
  const criterioTransicion = String(formData.get('criterio_transicion') ?? '').trim();

  if (!lot_code || !start_date || target_volume_liters <= 0 || !estadoLote || !materiaPrimaBase || !protocoloProceso) return;

  const inoculoDosisGl = inoculoDosisGlRaw ? Number(inoculoDosisGlRaw) : null;
  const relacionMateriaPrimaGl = relacionMateriaPrimaGlRaw ? Number(relacionMateriaPrimaGlRaw) : null;

  const [{ data: status }, { data: fallbackProduct }, { data: stage }, { data: tank }] = await Promise.all([
    supabase.from('cat_lot_status').select('id').order('is_closed').limit(1).maybeSingle(),
    supabase.from('finished_products').select('id').limit(1).maybeSingle(),
    supabase.from('cat_vinification_stages').select('id').eq('name', estadoLote).maybeSingle(),
    (supabase as any).from('capacity_tanks').select('id').eq('name', sistemaFermentacion).maybeSingle(),
  ]);
  if (!status?.id || !fallbackProduct?.id) return;

  const finalProductId = fallbackProduct.id;
  const stageId = stage?.id;
  if (!stageId) return;

  const metadata = {
    fruit_name: materiaPrimaBase,
    protocolo_proceso: protocoloProceso,
    inoculo_utilizado: inoculoUtilizado || null,
    inoculo_dosis_gl: Number.isFinite(inoculoDosisGl) ? inoculoDosisGl : null,
    relacion_materia_prima_gl: Number.isFinite(relacionMateriaPrimaGl) ? relacionMateriaPrimaGl : null,
    target_brix: brix,
    target_ph: ph,
    target_temperature_c: temperature_c,
    condicion_esperada_transicion: condicionEsperadaTransicion || null,
    criterio_transicion: criterioTransicion || null,
    sistema_fermentacion: sistemaFermentacion || null,
    estado_lote: estadoLote,
    notes: notes || null,
  };

  const { data: lot } = await supabase.from('wine_lots').insert({
    lot_code, start_date, target_volume_liters, current_volume_liters: target_volume_liters, current_stage_id: stageId, lot_status_id: status.id, finished_product_id: finalProductId, notes: JSON.stringify(metadata),
  }).select('id').maybeSingle();

  if (!lot?.id) return;

  await Promise.all([
    (supabase as any).from('lot_stage_history').insert({ lot_id: lot.id, stage_id: stageId, started_at: `${start_date}T00:00:00Z`, comments: 'Etapa inicial del lote' }),
    (supabase as any).from('lot_daily_metrics').upsert({ lot_id: lot.id, metric_date: start_date, brix, ph, temperature_c }, { onConflict: 'lot_id,metric_date' }),
    (supabase as any).from('bitacora_entries').insert({ lot_id: lot.id, entry_type: 'creacion_lote', details: `Lote creado para ${materiaPrimaBase} con protocolo ${protocoloProceso}. Brix inicial ${brix}; pH inicial ${ph}.`, tags: ['lote', 'inicio', 'materia_prima'] }),
    tank?.id ? (supabase as any).from('capacity_tanks').update({ current_lot_id: lot.id }).eq('id', tank.id) : Promise.resolve(),
  ]);

  revalidatePath('/lotes'); revalidatePath('/dashboard'); revalidatePath('/reportes');
}
