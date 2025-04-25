/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import Meal from "../Meal/Meal.model";
import MealProvider from "../MealProvider/MealProvider.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";

import httpStatus from 'http-status';
import { orderUtils } from "./order.utils";
import mongoose from "mongoose";


const orderMeal = async (payload: IOrder, email: string, role: string,client_ip:string) => {
  // Find the user (customer)

  // console.log(payload,'checking-order')

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Ensure the user is a customer
  if (role !== "customer") {
    throw new AppError(httpStatus.UNAUTHORIZED, "You must have a customer role to place an order");
  }



  // Find the meal

  const allOrderMeals = payload.selectedMeals

await Promise.all(
      allOrderMeals.map(async(meal)=>{
          const orderMeal = await Meal.findById(meal.mealId);
  if (!orderMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  if (orderMeal.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal is deleted");
  }

  if (!orderMeal.available) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal is not available");
  }
  return meal
      })
  )



  // Get the meal provider from the meal
 await Promise.all(
    allOrderMeals.map(async(provider)=>{
 const mealProviderData= await MealProvider.findById(provider.mealProviderId).select("_id");
 if (!mealProviderData) {
  throw new AppError(httpStatus.NOT_FOUND, "Meal provider not found");
}
    })
  )
 const allMealTotalPrice = allOrderMeals.reduce((sum,meal)=>sum+ meal.orderPrice,0)

 const totalPrice = allMealTotalPrice + payload.deliveryCharge





  // Create the order
  let order = await Order.create({
    ...payload,
    customerId: user._id, 
    totalPrice
  });
  
  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: user.name,
    customer_address: user.address,
    customer_email: user.email,
    customer_phone: user.phone,
    customer_city: user.city,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);


  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus
      },
    });
  }
  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);



  if (verifiedPayment.length) {
    const order = await Order.findOne({ "transaction.id": order_id });


    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    const paymentStatus = verifiedPayment[0].bank_status;
    let updatedMealStatus: "Pending" | "Failed" | "Cancelled" = "Pending";
    
    if (paymentStatus === "Success") {
      updatedMealStatus = "Pending"; 
    } else if (paymentStatus === "Failed") {
      updatedMealStatus = "Failed";
    } else {
      updatedMealStatus = "Cancelled";
    }
    
 

    // Update the order status and transaction details
    await Order.updateOne(
      { "transaction.id": order_id },
      {
        $set: {
          "transaction.bank_status": verifiedPayment[0].bank_status,
          "transaction.sp_code": verifiedPayment[0].sp_code,
          "transaction.sp_message": verifiedPayment[0].sp_message,
          "transaction.transactionStatus": verifiedPayment[0].transaction_status,
          "transaction.method": verifiedPayment[0].method,
          "transaction.date_time": verifiedPayment[0].date_time,
    
 
          "selectedMeals.$[].status": updatedMealStatus,
        },
      }
    );
    // console.log("Updated Meals:", updatedOrder?.selectedMeals);
    // Update Meal stock if the payment is successful
    // if (verifiedPayment[0].bank_status === 'Success') {
    //   for (const item of order.cars) {
    //     const car = await Meal.findById(item.car);
    //     if (car) {
    //       const newStock = Math.max(car.stock - item.quantity, 0);
    //       car.stock = newStock;
    //       await car.save();
    //     }
    //   }
    // }
  }

  return verifiedPayment;
};


//single order
const oneOrderDetails = async (orderId: string) => {
  
  const result = await Order.findById(orderId)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order is not found");
  }
  return result
 
};

//single Order with Common Delivery Address
const oneOrderMealDetails = async (orderId: string,mealId:string) => {
  
  const order = await Order.findById(orderId)

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order is not found");
  }

  const selectedMeals = order.selectedMeals.find((meal)=>meal._id.toString() === mealId)

  if(!selectedMeals){
    throw new AppError(httpStatus.NOT_FOUND, "Meal is not found");
  }

  const result ={
    _id:order._id,
    customerId: order.customerId,
    deliveryDate: order.deliveryDate,
    deliveryTime: order.deliveryTime,
    deliveryAddress: order.deliveryAddress,
    deliveryArea: order.deliveryArea,
    paymentMethod: order.paymentMethod,
    selectedMeals:[selectedMeals],
    transaction:order.transaction
  }

  return result
 
};



const getAllOrderOfMealProvider = async (query:Record<string,unknown>,email:string) => {
  const user = await User.findOne({email}).select('_id').lean()
 
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "Meal Provider not found");
  }

  const mealProvider = await MealProvider.findOne({userId:user}).select('_id').lean()

  if(!mealProvider){
    throw new AppError(httpStatus.NOT_FOUND, "mealProvider not found");
  }

const orderData = await Order.aggregate([
    {
      $unwind:'$selectedMeals'
    },
    {
      $match:{'selectedMeals.mealProviderId':mealProvider?._id}
    },

    {
      $lookup:{
        from:"users",
        localField:"customerId",
        foreignField:"_id",
        as:"customerId"
      }
    },
    { $unwind: '$customerId' },
  ])

const result = orderData.map((item)=>({
  ...item,
  selectedMeals:[item.selectedMeals]
}))

  return result
};

const getMyOrder = async (query:Record<string,unknown>,email:string) => {
  const user = await User.findOne({email})
  
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const orderQuery = new QueryBuilder(Order.find({
    customerId:user?._id})
    .populate({
      path:"selectedMeals.mealId"
    })
    ,query)
  .filter()
  .sort()
  .paginate()
  .fields()
  // .search(userSearchableFields)


  const result = await orderQuery.modelQuery
  const meta = await orderQuery.countTotal()
  return {
    result,
    meta
  };
};


const updateOrder = async (
  orderId: string,
  mealId:string,
  payload: Partial<IOrder>,
  email: string
) => {

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const order = await Order.findOne({_id:orderId})

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  

const orderMeal = await Order.findOne({
  'selectedMeals._id': new mongoose.Types.ObjectId(mealId) 
}).lean();


  if (!orderMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Order Meal not found");
  }


  const updateFields: any = {};

  if (payload.deliveryDate) updateFields.deliveryDate = payload.deliveryDate;
  if (payload.deliveryTime) updateFields.deliveryTime = payload.deliveryTime;
  if (payload.deliveryAddress) updateFields.deliveryAddress = payload.deliveryAddress;
  

  if (payload.selectedMeals && payload.selectedMeals.length > 0) {
    const selectedMealUpdate = payload.selectedMeals[0];
  
    const result = await Order.updateOne(
      { _id: orderId, "selectedMeals._id": mealId },
      {
        $set: {
          ...updateFields,
          "selectedMeals.$": {
            ...selectedMealUpdate,
          },
        },
      }
    );
  
    return result;
  }
  
  const result = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateFields },
    { new: true }
  );
  
  return result;
  

}



export const OrderServices = {
  orderMeal,
  oneOrderDetails,
  updateOrder,
  getMyOrder,
  getAllOrderOfMealProvider,
  verifyPayment,
  oneOrderMealDetails
};