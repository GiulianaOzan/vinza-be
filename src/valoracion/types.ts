import { z } from 'zod';
import { createValoracionSchema, updateValoracionSchema } from './schema';

export type CreateValoracionDto = z.infer<typeof createValoracionSchema>;
export type UpdateValoracionDto = z.infer<typeof updateValoracionSchema>;
