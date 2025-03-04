import { Document, Schema } from "mongoose";


export interface IMeal extends Document {
    name: string;                   
    category: string;              
    price: number;                    
    ingredients: string[];            
    portionSize: string;              
    available: boolean;              
    description?: string;            
    imageUrls: string[];              
    dietaryPreferences?: string[];   
    mealProvider: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }