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
import { execArgv } from "process";

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

//all meals for everyone
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

//all meals of provider own
const getMyMeal = async (email:string,query: Record<string, unknown>) => {

  const user = await User.findOne({ email: email }).select('_id')

  const mealProvider = await MealProvider.findOne({userId:user}).select('_id')

    const meal = await Meal.findOne({
      mealProvider
    })

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
  
    if(!mealProvider){
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized for that meal");
    }
    if (!meal) {
      throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
    }

  const mealQuery = new QueryBuilder(Meal.find({isDeleted:false}).populate("mealProvider").lean(), query)
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




//update Meal
const updateMeal = async (
  mealId: string,
  payload: Partial<IMeal>,
  email: string
) => {

  const user = await User.findOne({ email: email }).select('_id')
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const mealProvider = await MealProvider.findOne({userId:user}).select('_id')

  if(!mealProvider){
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized for that meal");
  }
 

  const mealData = await Meal.findById(mealId);
  if (!mealData || mealData.mealProvider.toString() !== mealProvider._id.toString()) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not the owner of this meal");
  }
  

    if(mealData.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST, "The meal you are trying to access has already been deleted");
    }


    const session = await mongoose.startSession();

    try {
      session.startTransaction();
  
      // Transaction-1: Create Meal

      const updateMeal = await Meal.findByIdAndUpdate(mealId, payload, {session, new: true });
     
      if (!updateMeal) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create meal');
      }
  
    
         // Check if availability changed
    if (payload.available !== undefined && payload.available !== mealData.available) {
      if (payload.available) {
        // Add meal to availableMeals only if not already present
        await MealProvider.findOneAndUpdate(
          { _id: mealProvider },
          { $addToSet: { availableMeals: mealId } }, // Prevents duplicate addition
          { session }
        );
      } else {
        // Remove meal from availableMeals if it exists
        await MealProvider.findOneAndUpdate(
          { _id: mealProvider },
          { $pull: { availableMeals: mealId } }, // Removes if exists
          { session }
        );
      }
    }
  
      await session.commitTransaction();
      await session.endSession();
  
      return updateMeal;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Failed to update meal');
    }




  
}

export const mealService = {
    createMeal,
    getAllMeals,
    getMyMeal,
    getSingleMeal,
    updateMeal,
};
