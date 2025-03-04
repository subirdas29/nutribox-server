import { model, Schema } from "mongoose";
import { IReview } from "./Review.interface";

const reviewSchema = new Schema<IReview>({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealProviderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
  }, { timestamps: true });
  
  const Review = model<IReview>('Review', reviewSchema);
  export default Review;