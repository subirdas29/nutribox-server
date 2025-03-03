import { Document, Schema } from "mongoose";

// Meal item structure
interface MealItem {
  mealId: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  price: number; 
}


interface Customization {
  option: string; 
  value: string; 
}

export enum OrderStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export interface IOrder extends Document {
  orderId: string;
  email: string;
  customerId: Schema.Types.ObjectId;  
  mealSelection: MealItem[];          
  dietaryPreferences?: string[];     
  customizations?: Customization[];   
  status: OrderStatus;                 
  totalPrice: number;                
  orderDate: Date;                     
  deliveryDate: Date;                  
  deliveryTime?: string;            
  mealProviderId: Schema.Types.ObjectId;  
  paymentStatus: "Paid" | "Pending";   
}
