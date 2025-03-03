import { Document, Schema } from "mongoose";

interface MealItem {
  mealId: Schema.Types.ObjectId;
  name: string;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  email: string;
  mealSelection: MealItem[];
  dietaryPreferences: string[];
  status: "Pending" | "In Progress" | "Delivered" | "Cancelled";
  totalPrice: number;
  orderDate: Date;
  mealProviderId: Schema.Types.ObjectId; // Meal Provider ID added
}