
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import Meal from "../Meal/Meal.model";
import MealProvider from "../MealProvider/MealProvider.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";

import httpStatus from 'http-status';
import { orderUtils } from "./order.utils";


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



    // Update the order status and transaction details
    await Order.findOneAndUpdate(
      { "transaction.id": order_id },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Pending"
            : verifiedPayment[0].bank_status == "Failed"
            ? "Failed"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "Cancelled"
            : "",
      }
    );

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


const getAllOrder = async (query:Record<string,unknown>,email:string) => {
  const user = await User.findOne({email}).select('_id')
 
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const mealProvider = await MealProvider.findOne({userId:user}).select('_id')

  if(!mealProvider){
    throw new AppError(httpStatus.NOT_FOUND, "mealProvider not found");
  }



  const orderQuery = new QueryBuilder(Order.find({mealProviderId:mealProvider}).populate('customerId').populate('mealId'),query)
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

const getMyOrder = async (query:Record<string,unknown>,email:string) => {
  const user = await User.findOne({email})
  
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const orderQuery = new QueryBuilder(Order.find({
    customerId:user?._id}).populate('mealId').populate('mealProviderId'),query)
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
  payload: Partial<IOrder>,
  email: string
) => {

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }


  return await Order.findByIdAndUpdate(orderId, payload, { new: true });
}


export const OrderServices = {
  orderMeal,
  oneOrderDetails,
  updateOrder,
  getMyOrder,
  getAllOrder,
  verifyPayment
};