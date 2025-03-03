import { model, Schema } from "mongoose";
import { IMealProvider } from "./provider.interface";

// Meal Provider Schema Update: Meal items included inline
const MealProviderSchema = new Schema<IMealProvider>({
  name: { type: String, required: true },
  cuisineSpecialties: [{ type: String, required: true }],
  mealsOffered: [{
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: [String],
    available: { type: Boolean, default: true }
  }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }], // Order Reference
  pricing: {
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true }
  },
  experience: { type: Number, required: true },
  customerReviews: [{
    user: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  }],
  location: {
    city: { type: String, required: true },
    address: { type: String }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export const MealProvider = model<IMealProvider>("MealProvider", MealProviderSchema);
