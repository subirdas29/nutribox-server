"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SelectedMealSchema = new mongoose_1.Schema({
    mealId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Meal" },
    mealProviderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "MealProvider" },
    category: { type: String, required: true },
    mealName: { type: String, required: true },
    quantity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    orderPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "In-Progress", "Delivered", "Cancelled", "Failed"],
        default: "Pending",
    },
    portionSize: { type: String, required: true },
    customizations: { type: [String], default: [] },
    specialInstructions: { type: String, default: "" },
});
const TransactionSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    transactionStatus: { type: String, required: true },
    bank_status: { type: String, required: true },
    sp_code: { type: String, required: true },
    sp_message: { type: String, required: true },
    method: { type: String, required: true },
    date_time: { type: String, required: true },
});
const OrderSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    selectedMeals: { type: [SelectedMealSchema], required: true },
    totalPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    deliveryArea: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliveryTime: { type: String },
    transaction: { type: TransactionSchema },
    paymentMethod: { type: String, required: true },
}, {
    timestamps: true,
});
OrderSchema.index({ 'selectedMeals.mealProviderId': 1 });
const Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.default = Order;
