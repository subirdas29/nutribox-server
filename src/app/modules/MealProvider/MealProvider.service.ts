import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import Meal from "../Meal/Meal.model";
import { User } from "../user/user.model";
import { IMealProvider, } from "./MealProvider.interface";
import MealProvider from "./MealProvider.model";

import httpStatus from 'http-status';



const mealProvider = async (payload: IMealProvider,email:string) => {

 const user = await User.findOne({email})

 if (!user) {
  throw new AppError(httpStatus.NOT_FOUND,"User not found");
}

 const availableMeals = await Meal.find({mealProvider:user?._id }).select("_id")



    const providerDetails = {
        ...payload, 
        userId:user?._id,
        availableMeals:availableMeals
    }


  const result = await MealProvider.create(providerDetails);
  return result;
};

const getAllMealProvider = async (query:Record<string,unknown>,email:string) => {
  const user = await User.findOne({email})

  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const mealQuery = new QueryBuilder(MealProvider.find({userId:user?._id}).populate("userId").populate("availableMeals").lean(),query)
  .filter()
  .sort()
  .paginate()
  .fields()
  // .search(userSearchableFields)

  const result = await mealQuery.modelQuery
  const meta = await mealQuery.countTotal()
  return {
    result,
    meta
  };
};


export const mealProviderServices = {
  mealProvider,
  getAllMealProvider
};