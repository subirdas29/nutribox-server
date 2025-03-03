import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

import { statusEnum } from './order.constant';

 

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cars: [
      {
        car: {
          type: Schema.Types.ObjectId,
          ref: "Car",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      // required: opt,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: "Pending",
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true,
  },
);



export const Order = model<TOrder>('Order', orderSchema);
