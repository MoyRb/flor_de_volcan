import { z } from 'zod';

export const etapaSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2).max(30),
  name: z.string().trim().min(2).max(100),
  stage_order: z.coerce.number().int().min(1).max(999),
  is_active: z.boolean().default(true),
});
