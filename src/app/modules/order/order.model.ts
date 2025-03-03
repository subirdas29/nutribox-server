import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from './order.interface'; // Assuming the interface is in order.interface.ts

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  mealSelection: [{
    mealId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  dietaryPreferences: [{ type: String }],
  customizations: [{
    option: { type: String, required: true },
    value: { type: String, required: true },
  }],
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String },  // Optional
  mealProviderId: { type: Schema.Types.ObjectId, ref: 'MealProvider', required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);
