import { z } from 'zod';

export const tipoVinoSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().trim().min(2, 'SKU obligatorio').max(40),
  name: z.string().trim().min(2, 'Nombre obligatorio').max(120),
  presentation: z.string().trim().max(120).optional(),
  is_active: z.boolean().default(true),
});
