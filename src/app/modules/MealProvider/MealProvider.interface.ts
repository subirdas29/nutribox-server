import { Document, Schema } from "mongoose";

export interface IMealProvider extends Document {
  userId: Schema.Types.ObjectId; 
  cuisineSpecialties?: string[];
  availableMeals?: Schema.Types.ObjectId[]; 
  experience?: number;
  reviews?: Schema.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}
