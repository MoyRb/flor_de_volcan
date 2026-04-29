/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';

type LotActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialLotActionState: LotActionState = { success: false, message: '' };

const lotSchema = z.object({
  lot_code: z.string().trim().min(1, 'El código de lote es obligatorio.'),
  start_date: z.string().trim().min(1, 'La fecha de inicio es obligatoria.'),
  liters: z.coerce.number().positive('El volumen debe ser mayor a 0.'),
  notes: z.string().optional(),
  base_material: z.string().trim().min(1, 'La materia prima base es obligatoria.'),
  protocolo_proceso: z.string().trim().min(1, 'El protocolo de proceso es obligatorio.'),
  estado_lote: z.string().trim().min(1, 'El estado del lote es obligatorio.'),
  sistema_fermentacion: z.string().optional(),
  brix: z.coerce.number({ invalid_type_error: 'Brix inválido.' }),
  ph: z.coerce.number({ invalid_type_error: 'pH inválido.' }),
  temperature_c: z.string().optional(),
  inoculo_utilizado: z.string().optional(),
  inoculo_dosis_gl: z.string().optional(),
  relacion_materia_prima_gl: z.string().optional(),
  condicion_esperada_transicion: z.string().optional(),
  criterio_transicion: z.string().optional(),
});

export async function createLot(prevState: LotActionState = initialLotActionState, formData: FormData): Promise<LotActionState> {
  void prevState;

  const rawEntries = Object.fromEntries(formData.entries());
  console.log('[createLot] raw FormData entries:', rawEntries);

  const parsed = lotSchema.safeParse({
    lot_code: formData.get('lot_code'),
    start_date: formData.get('start_date'),
    liters: formData.get('liters'),
    notes: formData.get('notes'),
    base_material: formData.get('base_material'),
    protocolo_proceso: formData.get('protocolo_proceso'),
    estado_lote: formData.get('estado_lote'),
    sistema_fermentacion: formData.get('sistema_fermentacion'),
    brix: formData.get('brix'),
    ph: formData.get('ph'),
    temperature_c: formData.get('temperature_c'),
    inoculo_utilizado: formData.get('inoculo_utilizado'),
    inoculo_dosis_gl: formData.get('inoculo_dosis_gl'),
    relacion_materia_prima_gl: formData.get('relacion_materia_prima_gl'),
    condicion_esperada_transicion: formData.get('condicion_esperada_transicion'),
    criterio_transicion: formData.get('criterio_transicion'),
  });

  console.log('[createLot] validation result:', parsed.success ? parsed.data : parsed.error.flatten());

  if (!parsed.success) {
    return { success: false, message: 'Error de validación en el formulario.', errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    lot_code, start_date, liters: target_volume_liters, notes = '', base_material: materiaPrimaBase, protocolo_proceso: protocoloProceso,
    estado_lote: estadoLote, sistema_fermentacion: sistemaFermentacion = '', brix, ph, temperature_c: tempRaw = '', inoculo_utilizado: inoculoUtilizado = '',
    inoculo_dosis_gl: inoculoDosisGlRaw = '', relacion_materia_prima_gl: relacionMateriaPrimaGlRaw = '', condicion_esperada_transicion: condicionEsperadaTransicion = '', criterio_transicion: criterioTransicion = '',
  } = parsed.data;

  const temperature_c = tempRaw ? Number(tempRaw) : null;
  const inoculoDosisGl = inoculoDosisGlRaw ? Number(inoculoDosisGlRaw) : null;
  const relacionMateriaPrimaGl = relacionMateriaPrimaGlRaw ? Number(relacionMateriaPrimaGlRaw) : null;

  const [{ data: status, error: statusError }, { data: fallbackProduct, error: productError }, { data: stage, error: stageError }, { data: tank, error: tankError }] = await Promise.all([
    supabase.from('cat_lot_status').select('id').order('is_closed').limit(1).maybeSingle(),
    supabase.from('finished_products').select('id').limit(1).maybeSingle(),
    supabase.from('cat_vinification_stages').select('id').eq('name', estadoLote).maybeSingle(),
    (supabase as any).from('capacity_tanks').select('id').eq('name', sistemaFermentacion).maybeSingle(),
  ]);

  if (statusError || productError || stageError || tankError) {
    console.error('[createLot] reference query errors:', { statusError, productError, stageError, tankError });
    return { success: false, message: 'No se pudieron cargar catálogos para crear el lote.' };
  }
  if (!status?.id || !fallbackProduct?.id || !stage?.id) {
    console.error('[createLot] missing reference ids:', { status, fallbackProduct, stage });
    return { success: false, message: 'Faltan catálogos requeridos (estado, producto o etapa).' };
  }

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

  const lotPayload = {
    lot_code,
    start_date,
    target_volume_liters,
    current_volume_liters: target_volume_liters,
    current_stage_id: stage.id,
    lot_status_id: status.id,
    finished_product_id: fallbackProduct.id,
    notes: JSON.stringify(metadata),
  };
  console.log('[createLot] final lot payload:', lotPayload);

  const { data: lot, error: lotInsertError } = await supabase.from('wine_lots').insert(lotPayload).select('id').maybeSingle();
  console.log('[createLot] insert wine_lots response:', { lot, lotInsertError });
  if (lotInsertError || !lot?.id) {
    console.error('[createLot] lot insert failed:', lotInsertError);
    return { success: false, message: `Error al crear lote: ${lotInsertError?.message ?? 'sin id de lote retornado'}` };
  }

  const sideEffectsResults = await Promise.all([
    (supabase as any).from('lot_stage_history').insert({ lot_id: lot.id, stage_id: stage.id, started_at: `${start_date}T00:00:00Z`, comments: 'Etapa inicial del lote' }),
    (supabase as any).from('lot_daily_metrics').upsert({ lot_id: lot.id, metric_date: start_date, brix, ph, temperature_c }, { onConflict: 'lot_id,metric_date' }),
    (supabase as any).from('bitacora_entries').insert({ lot_id: lot.id, entry_type: 'creacion_lote', details: `Lote creado para ${materiaPrimaBase} con protocolo ${protocoloProceso}. Brix inicial ${brix}; pH inicial ${ph}.`, tags: ['lote', 'inicio', 'materia_prima'] }),
    tank?.id ? (supabase as any).from('capacity_tanks').update({ current_lot_id: lot.id }).eq('id', tank.id) : Promise.resolve({ error: null }),
  ]);
  console.log('[createLot] side effects responses:', sideEffectsResults);

  const sideEffectError = sideEffectsResults.find((result: any) => result?.error)?.error;
  if (sideEffectError) {
    console.error('[createLot] side effect error:', sideEffectError);
    return { success: false, message: `Lote creado pero falló una operación relacionada: ${sideEffectError.message}` };
  }

  revalidatePath('/lotes');
  revalidatePath('/dashboard');
  redirect('/lotes');
}
