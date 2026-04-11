import { z } from 'zod';

export const clienteSchema = z.object({
  id: z.string().uuid().optional(),
  client_code: z.string().trim().min(2).max(30),
  legal_name: z.string().trim().min(2).max(140),
  commercial_name: z.string().trim().max(140).optional(),
  tax_id: z.string().trim().max(40).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email('Correo inválido').or(z.literal('')),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  credit_limit: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});
