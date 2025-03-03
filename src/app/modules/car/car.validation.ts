import { z } from 'zod';
import { categoryEnum } from './car.constant';


const carSchema = z.object({
  body:z.object({
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    price: z.number().min(0, "Price must be a positive number"),
    category: categoryEnum.optional(), 
    description: z.string().min(10, "Description must be at least 10 characters"),
    stock: z.number().min(0, "Stock cannot be negative"),
    imageUrl: z.string().url("Invalid image URL").optional(),
    isStock: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
});
const updateCarSchema = z.object({
  body:z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    price: z.number().optional(),
    category: categoryEnum.optional(),
    description: z.string().optional(),
    stock: z.number().optional(),
    imageUrl: z.string().optional(),
    isStock: z.boolean().optional(),
  })
});

export const CarValidation = {
   carSchema,
   updateCarSchema
  };
  
