import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { mealProviderServices } from "./MealProvider.service";
import httpStatus from 'http-status';

const mealProviderController = catchAsync(async (req, res) => {

    const {email} = req.user;
  
    const result = await mealProviderServices.mealProvider(
      req.body,email);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Data placed successfully',
      data: result,
    });
  });
  

  // Get All MealsController
const getAllMealsController = catchAsync(async (req, res) => {
  const query = req.query
  const {email} = req.user
  const result = await mealProviderServices.getAllMealProvider(query,email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meals fetched successfully",
    meta:result.meta,
    data: result.result,
  });
});


  export const MealProviderController = {
    mealProviderController,
    getAllMealsController 

  };
  