import { Schema, Document} from "mongoose";

// Define the meal item structure for inline meals
interface IMeal {
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  portionSize: string;  // New field for portion size
  available: boolean;
}

export interface IMealProvider extends Document {
  name: string;
  cuisineSpecialties: string[];
  mealsOffered: IMeal[]; // Meals offered as inline objects
  orders: Schema.Types.ObjectId[];  // Order references
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
  updatedAt: Date;
}
