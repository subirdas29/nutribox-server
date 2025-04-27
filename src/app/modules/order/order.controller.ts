

import { OrderServices } from './order.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';


// Create Order Controller
const orderMealController = catchAsync(async (req, res) => {

  const {email,role} = req.user;

  
  const result = await OrderServices.orderMeal(
    req.body,email,role,req.ip!);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {

  const result = await OrderServices.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: result,
  });
});

const getMyOrder = catchAsync(async (req, res) => {
  const query = req.query
  const {email} = req.user
  const result = await OrderServices.getMyOrder(query,email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Orders fetched successfully",
    meta:result.meta,
    data: result.result,
  });
});

//mealprovider order
const getAllOrderOfMealProvider = catchAsync(async (req, res) => {
  const query = req.query
  const {email} = req.user
  const result = await OrderServices.getAllOrderOfMealProvider(query,email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Orders fetched successfully",
    // meta:result.meta,
    data:result
    // data: result.result,
  });
});




// Get One CarController
const oneOrderDetailsController =
catchAsync(async (req, res) => {

  const orderId = req.params.orderId;
  const result = await OrderServices.oneOrderDetails(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

//Get One Order with Common delivery Address
const oneOrderMealController =
catchAsync(async (req, res) => {

  const {orderId,mealId} = req.params;

  const result = await OrderServices.oneOrderMealDetails(orderId,mealId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});





const updateOrderController = catchAsync(async (req, res) => {
  const {
    body: payload,
    params: { orderId,mealId },
  } = req;

  const {email} = req.user;
  const result = await OrderServices.updateOrder(
    orderId,
    mealId,
    payload,
    email
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});


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
  updateOrderController,
  getMyOrder,
  getAllOrderOfMealProvider,
  verifyPayment,

  oneOrderDetailsController,
  oneOrderMealController
 
};
