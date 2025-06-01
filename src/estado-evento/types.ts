import { z } from 'zod';
import { createEstadoEventoSchema, updateEstadoEventoSchema } from './schema';

export type CreateEstadoEventoDto = z.infer<typeof createEstadoEventoSchema>;
export type UpdateEstadoEventoDto = z.infer<typeof updateEstadoEventoSchema>;
