import { z } from 'zod';

export const unidadSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(1, 'Clave obligatoria').max(20),
  name: z.string().trim().min(2, 'Nombre obligatorio').max(80),
  is_active: z.boolean().default(true),
});
