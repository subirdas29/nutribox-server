import { Schema, Document } from "mongoose";

// Define the meal item structure for inline meals
interface IMeal {
    name: string;
    category: string;
    price: number;
    ingredients: string[];
    available: boolean;
}

export interface IMealProvider extends Document {
    name: string;
    cuisineSpecialties: string[];
    mealsOffered: IMeal[]; // Direct meal items now embedded in the provider
    orders: Schema.Types.ObjectId[]; // Orders associated with this provider
    pricing: {
        minPrice: number;
        maxPrice: number;
    };
    experience: number;
    customerReviews: {
        user: string;
        rating: number;
        comment?: string;
    }[];
    location: {
        city: string;
        address?: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    createdAt: Date;
}
