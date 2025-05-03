import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { SubscribeService } from "./Subscribe.service";


const createSubscribeController = catchAsync(async (req, res) => {

    // const {email} = req.user;
    const result = await SubscribeService.createSubscribe(
      req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Thanks for subscribing! Stay tuned for updates and offers.',
      data: result,
    });
  });

  export const SubscribeController = {
    createSubscribeController
  };