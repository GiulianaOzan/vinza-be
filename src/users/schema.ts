import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  roleId: z.number().optional(),
});
