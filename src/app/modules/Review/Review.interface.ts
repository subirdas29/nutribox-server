import { Schema } from "mongoose";

export interface IReview extends Document {
    customerId: Schema.Types.ObjectId; // Reference to Customer
    mealProviderId: Schema.Types.ObjectId; // Reference to Meal Provider
    rating: number; // Rating between 1 to 5
    review: string; // Review text
    createdAt: Date;
  }