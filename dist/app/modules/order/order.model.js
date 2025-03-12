"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    mealProviderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'MealProvider', required: true },
    mealId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Meal', required: true },
    mealName: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ["pending", "in progress", "delivered", "cancelled"], default: "pending" },
    basePrice: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    portionPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, required: true, default: Date.now },
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String },
    portionSize: { type: String, enum: ["small", "medium", "large"], required: true },
    deliveryArea: { type: String, enum: ["dhaka", "outside-dhaka", "international"], required: true },
    deliveryAddress: { type: String, required: true },
    customizations: { type: [String] },
    specialInstructions: { type: String }
}, { timestamps: true });
const Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.default = Order;
