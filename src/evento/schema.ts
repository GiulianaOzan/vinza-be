import { z } from 'zod';

export const createEventoSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  cupo: z.string(),
  sucursalId: z.number(),
  estadoId: z.number(),
  categoriaId: z.number(),
});

export const updateEventoSchema = z.object({
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  cupo: z.string().optional(),
  sucursalId: z.number().optional(),
  estadoId: z.number().optional(),
  categoriaId: z.number().optional(),
});
