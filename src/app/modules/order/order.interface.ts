// import { Schema, Document } from "mongoose";

import { Schema } from "mongoose";

// export interface IOrder extends Document {
//   customerId: Schema.Types.ObjectId;
//   mealProviderId:Schema.Types.ObjectId;
//   mealId: Schema.Types.ObjectId;
//   mealName:string;
//   status?: 'pending' | 'in-progress' | 'delivered' | 'cancelled'
//   category:string;
//   basePrice:number;
//   deliveryCharge:number;
//   portionPrice:number;
//   totalPrice: number;
//   orderDate: Date;
//   deliveryDate: Date;
//   deliveryTime?: string;
//   portionSize: "small" | "medium" | "large"; 
//   deliveryArea: "dhaka" | "outside-dhaka" | "international"; 
//   deliveryAddress: string; // Specific address
//   customizations?: string[];
//   specialInstructions?:string
// }

// interfaces/IOrder.ts
export interface IOrder {
  customerId: Schema.Types.ObjectId;
  mealId: Schema.Types.ObjectId;
  mealProviderId: Schema.Types.ObjectId;
  category:string;
  mealName:string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  portionSize: string;
  customizations: string[];
  specialInstructions: string;
  shippingAddress: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryDate: Date;
  deliveryTime: string;
  status?: "pending" | "in-progress" | "delivered" | "cancelled";
  transaction: {
    id: string,
    transactionStatus: string,
    bank_status: string,
    sp_code: string,
    sp_message: string,
    method: string,
    date_time: string,
  },
  paymentMethod: string;
}