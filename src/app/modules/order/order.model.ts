import { Schema, model } from "mongoose";
import { IOrder, ISelectedMeal, ITransaction } from "./order.interface";

const SelectedMealSchema = new Schema<ISelectedMeal>(
  {
    mealId: { type: Schema.Types.ObjectId, required: true, ref: "Meal" },
    mealProviderId: { type: Schema.Types.ObjectId, required: true, ref: "MealProvider" },
    category: { type: String, required: true },
    mealName: { type: String, required: true },
    quantity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    orderPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Delivered", "Cancelled","Failed"],
      default: "Pending",
    },
    portionSize: { type: String, required: true },
    customizations: { type: [String], default: [] },
    specialInstructions: { type: String, default: "" },
    _id: { type: Schema.Types.ObjectId, required: true }
  },
);

const TransactionSchema = new Schema<ITransaction>(
  {
    id: { type: String, required: true },
    transactionStatus: { type: String, required: true },
    bank_status: { type: String, required: true },
    sp_code: { type: String, required: true },
    sp_message: { type: String, required: true },
    method: { type: String, required: true },
    date_time: { type: String, required: true },
  }
);



const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    selectedMeals: { type: [SelectedMealSchema], required: true },
    totalPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    deliveryArea: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliveryTime: { type: String },
    transaction: { type: TransactionSchema },
    paymentMethod: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ 'selectedMeals.mealProviderId': 1 });

const Order = model<IOrder>("Order", OrderSchema);

export default Order;
