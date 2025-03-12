"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for MealProvider based on the interface you provided.
const mealProviderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    cuisineSpecialties: { type: [String], default: ['Indian', 'Bangladeshi'] },
    availableMeals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Meal", }],
    experience: { type: Number, default: 5 },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review" }],
}, { timestamps: true });
const MealProvider = (0, mongoose_1.model)("MealProvider", mealProviderSchema);
exports.default = MealProvider;
