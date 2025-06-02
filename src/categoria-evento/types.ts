import { z } from 'zod';
import {
  createCategoriaEventoSchema,
  updateCategoriaEventoSchema,
} from './schema';

export type CreateCategoriaEventoDto = z.infer<
  typeof createCategoriaEventoSchema
>;
export type UpdateCategoriaEventoDto = z.infer<
  typeof updateCategoriaEventoSchema
>;
