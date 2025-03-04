import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { mealService } from "./Meal.service";
import httpStatus from 'http-status';


const mealController = catchAsync(async (req, res) => {

    const {email} = req.user;


  
    const result = await mealService.createMeal(
      req.body,email);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Meals Created successfully',
      data: result,
    });
  });

  const getAllMealsController = catchAsync(async (req, res) => {
    const query = req.query
  
    const result = await mealService.getAllMeals(query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meals fetched successfully",
      meta:result.meta,
      data: result.result,
    });
  });
  
  export const MealController = {
    mealController,
    getAllMealsController
  };
  
