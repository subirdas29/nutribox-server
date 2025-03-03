

import { OrderServices } from './order.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';


// Create Order Controller
const orderMealController = catchAsync(async (req, res) => {

  // const {email} = req.user;

  const result = await OrderServices.orderMeal(
    req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

// const verifyPayment = catchAsync(async (req, res) => {
//   const result = await OrderServices.verifyPayment(req.query.order_id as string);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Order verified successfully',
//     data: result,
//   });
// });


// Get All CarsController
// const getAllOrderController = catchAsync(async (req, res) => {
//   const query = req.query

//   const result = await OrderServices.allOrdersDetails(query);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Orders fetched successfully",
//     meta:result.meta,
//     data: result.result,
//   });
// });

// Get One CarController
// const oneOrderDetailsController =
// catchAsync(async (req, res) => {
//   const orderId = req.params.orderId;
//   const result = await OrderServices.oneOrderDetails(orderId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Car fetched successfully",
//     data: result,
//   });
// });


// const deleteOrder =catchAsync(async (req, res) => {

//   const {orderId} = req.params

//   const result = await OrderServices.deleteOrder(orderId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order cancelled successfully',
//     data: result,
//   });
// });



// Calculate Revenue Controller




export const OrderController = {
  orderMealController,
  // verifyPayment,
  // ordersRevenueController,
  // getAllOrderController,
  // oneOrderDetailsController,
  // deleteOrder
};
