/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/src/lib/supabase/server';

function toNumber(value: FormDataEntryValue | null) {
  if (value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function resolveSensoryValue(formData: FormData, presetKey: string, customKey: string) {
  const custom = String(formData.get(customKey) ?? '').trim();
  if (custom) return custom;
  const preset = String(formData.get(presetKey) ?? '').trim();
  return preset || null;
}

export async function registerMeasurement(formData: FormData) {
  const supabase = await createClient();
  const lotId = String(formData.get('lot_id') ?? '');
  const readingAt = String(formData.get('reading_at') ?? '');
  const brix = toNumber(formData.get('brix'));
  const ph = toNumber(formData.get('ph'));
  const temperature = toNumber(formData.get('temperature_c'));
  const observations = String(formData.get('observations') ?? formData.get('note') ?? '').trim();
  const color = resolveSensoryValue(formData, 'color', 'color_custom');
  const aroma = resolveSensoryValue(formData, 'aroma', 'aroma_custom');
  const sabor = resolveSensoryValue(formData, 'sabor', 'sabor_custom');

  if (!lotId || !readingAt) return;
  if (brix === null && ph === null && temperature === null) return;

  const metricDate = readingAt.slice(0, 10);

  await supabase.from('lot_daily_metrics').upsert({
    lot_id: lotId,
    metric_date: metricDate,
    brix,
    ph,
    temperature_c: temperature,
    observations: observations || null,
    color,
    aroma,
    sabor,
  }, { onConflict: 'lot_id,metric_date' });

  const eventDetails = [
    `Brix ${brix ?? '-'}`,
    `pH ${ph ?? '-'}`,
    `Temp ${temperature ?? '-'}°C`,
    color ? `Color ${color}` : null,
    aroma ? `Aroma ${aroma}` : null,
    sabor ? `Sabor ${sabor}` : null,
    observations ? `Observaciones: ${observations}` : null,
  ].filter(Boolean).join(' · ');

  await (supabase as any).from('bitacora_entries').insert({
    entry_type: 'medicion',
    entry_date: readingAt,
    lot_id: lotId,
    details: `Medición registrada: ${eventDetails}`,
    tags: ['medicion'],
  });

  const { data: lot } = await supabase.from('wine_lots').select('start_date').eq('id', lotId).maybeSingle();
  if (lot?.start_date && brix !== null) {
    const day = Math.floor((Date.parse(metricDate) - Date.parse(lot.start_date)) / 86400000) + 1;
    if (day >= 5 && brix >= 13 && brix <= 14) {
      await (supabase as any).from('bitacora_entries').insert({
        entry_type: 'recomendacion',
        lot_id: lotId,
        details: 'Brix entre 13-14 desde día 5: se recomienda trasiego a otro recipiente para maduración.',
        tags: ['trasiego', 'recomendacion'],
      });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/mediciones');
  revalidatePath('/lotes');
  revalidatePath('/reportes');
}

export async function registerEvent(formData: FormData) {
  const supabase = await createClient();
  const lotId = String(formData.get('lot_id') ?? '');
  const eventType = String(formData.get('event_type') ?? 'observacion');
  const eventDate = String(formData.get('event_date') ?? new Date().toISOString());
  const details = String(formData.get('details') ?? '').trim();
  const tankId = String(formData.get('tank_id') ?? '').trim();

  if (!lotId || !details) return;

  await (supabase as any).from('bitacora_entries').insert({
    lot_id: lotId,
    tank_id: tankId || null,
    entry_type: eventType,
    entry_date: eventDate,
    details,
    tags: [eventType],
  });

  revalidatePath('/dashboard');
  revalidatePath('/reportes');
  revalidatePath('/mediciones');
}
