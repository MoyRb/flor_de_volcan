import { z } from 'zod';

export const frutaSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2, 'La clave es requerida').max(20),
  name: z.string().trim().min(2, 'El nombre es requerido').max(80),
  is_active: z.boolean().default(true),
});

export type FrutaInput = z.infer<typeof frutaSchema>;
