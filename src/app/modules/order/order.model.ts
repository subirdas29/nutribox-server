import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mealId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  status: { type: String, enum: ['pending', 'in progress', 'delivered'], required: true },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String },
  customizations: { type: [String] },
}, { timestamps: true });

const Order = model<IOrder>('Order', orderSchema);
export default Order;