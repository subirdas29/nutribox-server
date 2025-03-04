import { Schema, model } from "mongoose";
import { IMealProvider } from "./MealProvider.interface";

// Define the schema for MealProvider based on the interface you provided.
const mealProviderSchema = new Schema<IMealProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    cuisineSpecialties: { type: [String], required: true }, 
    availableMeals: [{ type: Schema.Types.ObjectId, ref: "Meal", required: true }],
    experience: { type: Number, required: true }, 
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true } 
);


const MealProvider = model<IMealProvider>("MealProvider", mealProviderSchema);

export default MealProvider;
