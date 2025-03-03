"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidation = void 0;
const zod_1 = require("zod");
const car_constant_1 = require("./car.constant");
const carSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z.string().min(1, "Brand is required"),
        model: zod_1.z.string().min(1, "Model is required"),
        price: zod_1.z.number().min(0, "Price must be a positive number"),
        category: car_constant_1.categoryEnum.optional(),
        description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
        stock: zod_1.z.number().min(0, "Stock cannot be negative"),
        imageUrl: zod_1.z.string().url("Invalid image URL").optional(),
        isStock: zod_1.z.boolean().optional(),
        createdAt: zod_1.z.date().optional(),
        updatedAt: zod_1.z.date().optional(),
    })
});
const updateCarSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        category: car_constant_1.categoryEnum.optional(),
        description: zod_1.z.string().optional(),
        stock: zod_1.z.number().optional(),
        imageUrl: zod_1.z.string().optional(),
        isStock: zod_1.z.boolean().optional(),
    })
});
exports.CarValidation = {
    carSchema,
    updateCarSchema
};
