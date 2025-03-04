/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { IMeal } from "./Meal.interface";
import Meal from "./Meal.model";
import httpStatus from 'http-status';
import MealProvider from "../MealProvider/MealProvider.model";

const createMeal = async (payload: IMeal, email: string) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const providerMeal = {
    ...payload, 
    mealProvider: user?._id
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Transaction-1: Create Meal
    const mealCreate = await Meal.create([providerMeal], { session });

    if (!mealCreate.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create meal');
    }

  
    if (mealCreate[0].available) {
      // Transaction-2
      const newMeal = await MealProvider.findOneAndUpdate(
        { userId: mealCreate[0].mealProvider },
        { $push: { availableMeals: mealCreate[0]._id } },
        { new: true, session }
      );

      if (!newMeal) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add meal to availableMeals');
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return mealCreate;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create meal');
  }
};


const getAllMeals = async (query: Record<string, unknown>) => {
    const mealQuery = new QueryBuilder(Meal.find().populate("mealProvider").lean(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    
    const result = await mealQuery.modelQuery;
    const meta = await mealQuery.countTotal();
    
    return {
        result,
        meta
    };
};

export const mealService = {
    createMeal,
    getAllMeals
};
