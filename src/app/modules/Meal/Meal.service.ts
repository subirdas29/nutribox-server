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
  const mealProviderId = await MealProvider.findOne({userId:user?._id})

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const providerMeal = {
    ...payload, 
    mealProvider: mealProviderId?._id
  };


  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Transaction-1: Create Meal
    const mealCreate = await Meal.create([providerMeal], { session });
   
    if (!mealCreate || mealCreate.length === 0) {
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
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add as availableMeals');
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

const getSingleMeal = async (mealId: string) => {
  const meal = await Meal.findById(mealId)
   

  if (!meal) {
     throw new AppError(httpStatus.NOT_FOUND, 'Meal not found');
  }

  if (meal.isDeleted) {
     throw new AppError(httpStatus.BAD_REQUEST, 'Meal is deleted');
  }


  const result = await Meal.findById(mealId)
  .populate({
    path: 'mealProvider',
    populate: {
      path: 'userId',
    },
  }
);

  return result
 
};


const updateMeal = async (
  mealId: string,
  payload: Partial<IMeal>,
  email: string
) => {

  const user = await User.findOne({ email: email });

  const mealProvider = await Meal.findOne({
    mealProvider:user?._id})

    const mealsId = await Meal.findOne({
      _id:mealId
    })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if(!mealProvider){
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized for that meal");
  }
  if (!mealsId) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }
  return await Meal.findByIdAndUpdate(mealId, payload, { new: true });
}

export const mealService = {
    createMeal,
    getAllMeals,
    getSingleMeal,
    updateMeal
};
