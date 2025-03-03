"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), { message: "Invalid ObjectId" });
const orderSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: objectIdSchema,
        email: zod_1.z.string(),
        cars: zod_1.z.array(zod_1.z.object({
            car: objectIdSchema,
            quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
        })),
        totalPrice: zod_1.z.number().min(0, "Total price must be a positive number").optional(),
        status: zod_1.z.enum(["Pending", "Paid", "Shipped", "Completed", "Cancelled"]),
        transaction: zod_1.z.object({
            id: zod_1.z.string(),
            transactionStatus: zod_1.z.string(),
            bank_status: zod_1.z.string(),
            sp_code: zod_1.z.string(),
            sp_message: zod_1.z.string(),
            method: zod_1.z.string(),
            date_time: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),
        }),
        createdAt: zod_1.z.optional(zod_1.z.date()),
        updatedAt: zod_1.z.optional(zod_1.z.date()),
    })
});
exports.orderValidation = {
    orderSchema
};
