import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { IMeal } from "./Meal.interface";
import Meal from "./Meal.model";
import httpStatus from 'http-status';

const createMeal = async (payload: IMeal,email:string) => {
    
    const user = await User.findOne({email:email})

    
 if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,"User not found");
  }

    const providerMeal = {
        ...payload, mealProvider:user?._id
    }

    const result = await Meal.create(providerMeal);
    return result;
  };


  const getAllMeals = async (query:Record<string,unknown>) => {
    const mealQuery = new QueryBuilder(Meal.find().populate("mealProvider").lean(),query)
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

  export const mealService = {
   createMeal,
   getAllMeals
  };