import { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  mealProviderId:Schema.Types.ObjectId;
  mealId: Schema.Types.ObjectId;
  mealName:string;
  status?: "pending" | "in progress" | "delivered";
  basePrice:number;
  deliveryCharge:number;
  portionPrice:number;
  totalPrice: number;
  orderDate: Date;
  deliveryDate: Date;
  deliveryTime?: string;
  portionSize: "small" | "medium" | "large"; 
  deliveryArea: "dhaka" | "outside-dhaka" | "international"; 
  deliveryAddress: string; // Specific address
  customizations?: string[];
  specialInstructions?:string
}