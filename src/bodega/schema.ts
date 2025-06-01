import { z } from 'zod';

export const UpdateBodegaSchema = z.object({
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
});

export const createBodegaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
});
