import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { mealProviderServices } from "./provider.service";
import httpStatus from 'http-status';

const mealProviderController = catchAsync(async (req, res) => {

    // const {email} = req.user;
  
    const result = await mealProviderServices.mealProvider(
      req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order placed successfully',
      data: result,
    });
  });
  

  export const MealProviderController = {
    mealProviderController,

  };
  