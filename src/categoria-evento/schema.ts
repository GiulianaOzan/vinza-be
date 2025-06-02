import { z } from 'zod';

export const createCategoriaEventoSchema = z.object({
  nombre: z.string(),
});

export const updateCategoriaEventoSchema = z.object({
  nombre: z.string().optional(),
});
