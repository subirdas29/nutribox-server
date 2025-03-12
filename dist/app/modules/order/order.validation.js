"use strict";
// import { Types } from 'mongoose';
// import { z } from 'zod';
// const objectIdSchema = z
//   .string()
//   .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid ObjectId" });
// const orderSchema = z.object({
//  body:z.object({
//   user: objectIdSchema,
//   email:z.string(),
//   cars: z.array(
//     z.object({
//       car: objectIdSchema,
//       quantity: z.number().int().min(1, "Quantity must be at least 1"),
//     })
//   ),
//   totalPrice: z.number().min(0, "Total price must be a positive number").optional(),
//   status: z.enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"]),
//   transaction: z.object({
//     id: z.string(),
//     transactionStatus: z.string(),
//     bank_status: z.string(),
//     sp_code: z.string(),
//     sp_message: z.string(),
//     method: z.string(),
//     date_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
//       message: "Invalid date format",
//     }),
//   }),
//   createdAt: z.optional(z.date()),
//   updatedAt: z.optional(z.date()),
//  })
// });
// export const orderValidation = {
//     orderSchema
// };
