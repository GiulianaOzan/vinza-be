import { z } from 'zod';

export const createEstadoEventoSchema = z.object({
  nombre: z.string(),
});

export const updateEstadoEventoSchema = z.object({
  nombre: z.string().optional(),
});
