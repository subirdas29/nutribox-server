import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";


const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  mealProviderId: { type: Schema.Types.ObjectId, ref: 'MealProvider', required: true },
  mealId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  mealName:{ type: String, required: true },
  status: { type: String, enum: ["pending", "in progress", "delivered"], default: "pending" },
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
  },
  { timestamps: true } 
);

const Order = model<IOrder>("Order", OrderSchema);

export default Order;
