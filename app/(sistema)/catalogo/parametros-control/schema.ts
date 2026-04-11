import { z } from 'zod';

const nullableNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  });

export const parametroSchema = z
  .object({
    id: z.string().uuid().optional(),
    code: z.string().trim().min(2).max(30),
    name: z.string().trim().min(2).max(120),
    unit_id: z.string().uuid().nullable(),
    min_value: nullableNumber,
    max_value: nullableNumber,
    warning_low: nullableNumber,
    warning_high: nullableNumber,
    is_required: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine((data) => data.min_value === null || data.max_value === null || data.min_value <= data.max_value, {
    message: 'El mínimo no puede ser mayor al máximo.',
    path: ['min_value'],
  });
