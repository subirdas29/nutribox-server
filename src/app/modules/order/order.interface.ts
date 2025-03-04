import { Schema } from "mongoose";

export interface IOrder extends Document {
    customerId: Schema.Types.ObjectId;
    mealId: Schema.Types.ObjectId;
    status: 'pending' | 'in progress' | 'delivered';
    totalPrice: number;
    orderDate: Date;
    deliveryDate: Date;
    deliveryTime?: string;
    customizations?: string[];
  }