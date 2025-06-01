import { z } from 'zod';

export const UpdateUserSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  email: z.string().email().optional(),
  fecha_nacimiento: z.date().optional(),
  roles: z.array(z.number()).optional(),
});

export const createUserSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  contrasena: z.string(),
  validado: z.date().optional(),
  fecha_nacimiento: z.date().optional(),
  roles: z.array(z.number()).optional(),
});
