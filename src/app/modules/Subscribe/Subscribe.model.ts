import { model, Schema } from "mongoose";

import { ISubscribe } from "./Subscribe.interface";


const SubscribeSchema = new Schema<ISubscribe>(
  {
    
    email: { type: String, required: true },
    
  },
  { timestamps: true }
);

export const Subscribe = model<ISubscribe>("Subscribe", SubscribeSchema);
