import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});


export const userValidation = {
  registerValidationSchema,
  updateProfileSchema
};
