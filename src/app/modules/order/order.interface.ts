// import { Schema, Document } from "mongoose";

import { Schema } from "mongoose";


// interfaces/IOrder.ts
export interface ISelectedMeal {
  mealId: Schema.Types.ObjectId;
  mealProviderId: Schema.Types.ObjectId;
  category: string;
  mealName: string;
  quantity: number;
  basePrice: number;
  orderPrice: number;
  status?: "Pending" | "In-Progress" | "Delivered" | "Cancelled" | "Failed";
  portionSize: string;
  customizations: string[];
  specialInstructions: string;
}

export interface ITransaction {
  id: string;
  transactionStatus: string;
  bank_status: string;
  sp_code: string;
  sp_message: string;
  method: string;
  date_time: string;
}

export interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  selectedMeals: ISelectedMeal[];
  totalPrice: number;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryCharge:number,
  deliveryDate: string;
  deliveryTime?: string;
  transaction: ITransaction;
  paymentMethod: string;
}
