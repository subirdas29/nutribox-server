"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for Meal based on the interface
const mealSchema = new mongoose_1.Schema({
    name: { type: String, required: true }, // Name of the meal
    category: { type: String, required: true }, // Category (e.g., Breakfast, Lunch, Dinner)
    price: { type: Number, required: true }, // Price of the meal
    ingredients: { type: [String], required: true }, // Ingredients list (array of strings)
    portionSize: {
        type: String,
        required: true
    },
    available: { type: Boolean, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String }, // Optional description of the meal
    imageUrls: { type: [String], required: true }, // Array of image URLs
    dietaryPreferences: { type: [String] }, // Optional: Dietary restrictions (e.g., Gluten-free, Vegan)
    isDeleted: {
        type: Boolean,
        default: false,
    },
    mealProvider: { type: mongoose_1.Schema.Types.ObjectId, ref: "MealProvider", required: true }, // Reference to the Meal Provider
}, { timestamps: true });
// Create the Meal model based on the schema
const Meal = (0, mongoose_1.model)("Meal", mealSchema);
exports.default = Meal;
