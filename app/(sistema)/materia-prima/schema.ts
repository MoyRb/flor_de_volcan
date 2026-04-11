import { z } from 'zod';

export const rawMaterialSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2, 'Clave requerida').max(30),
  name: z.string().trim().min(2, 'Nombre requerido').max(120),
  material_type_id: z.string().uuid('Tipo inválido'),
  base_unit_id: z.string().uuid('Unidad inválida'),
  min_stock: z.coerce.number().min(0, 'Stock mínimo inválido'),
  notes: z.string().max(500).optional(),
  is_active: z.boolean().default(true),
});

export const movementSchema = z.object({
  raw_material_id: z.string().uuid('Materia prima inválida'),
  movement_type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.coerce.number().positive('Cantidad inválida'),
  movement_date: z.string().datetime('Fecha inválida'),
  unit_cost: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  supplier_id: z.string().uuid().optional().or(z.literal('')),
  lot_id: z.string().uuid().optional().or(z.literal('')),
  reference: z.string().max(80).optional(),
  notes: z.string().max(500).optional(),
});
