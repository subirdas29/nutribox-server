import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true },
  email: { type: String, required: true },
  mealSelection: [{
      mealId: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true }
  }],
  dietaryPreferences: [{ type: String }],
  status: { type: String, enum: ["Pending", "In Progress", "Delivered", "Cancelled"], default: "Pending" },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  mealProviderId: { type: Schema.Types.ObjectId, ref: "MealProvider", required: true } // Added provider reference
});

export const Order = model<IOrder>("Order", OrderSchema);
