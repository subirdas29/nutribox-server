/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';

import httpStatus from 'http-status';

import AppError from '../../errors/AppError';

import { User } from '../user/user.model';

import { orderSearchableFields } from './order.constant';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { TUser } from '../user/user.interface';

import { Car } from '../car/car.model';
import { orderUtils } from './order.utils';

const orderACar = async (
  email:string,
  payload:TOrder,client_ip:string) => {

  const user:TUser= (await User.findOne({email:email}))!

  if(user.status === 'blocked'){
    throw new AppError(httpStatus.BAD_REQUEST, 'Your Account is Deactivate by admin!')
  }

  if(user?.isDeleted === true){
    throw new AppError(httpStatus.BAD_REQUEST, 'Your Account is Deleted !')
  }
 

  if (!payload?.cars?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Order is not specified");



  const cars = payload.cars

  let totalPrice = 0;
  const carDetails = await Promise.all(
    cars.map(async (item) => {
      const car = await Car.findById(item.car);
      if(!car){
        throw new AppError(httpStatus.NOT_FOUND,"Car Not Found")
      }
  
        if(car.stock===0){
          throw new AppError(httpStatus.NOT_ACCEPTABLE, "Sorry, the car you selected is currently out of stock. Please choose another car or check back later.");
        }

        const subtotal = car ? (car.price || 0) * item.quantity : 0;
        totalPrice += subtotal;
        return item;
   
    })
  );

  let order = await Order.create({
    email,
    user,
    cars: carDetails,
    totalPrice,
  });
  // console.log(order)

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
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "Cancelled"
            : "",
      }
    );

    // Update car stock if the payment is successful
    if (verifiedPayment[0].bank_status === 'Success') {
      for (const item of order.cars) {
        const car = await Car.findById(item.car);
        if (car) {
          const newStock = Math.max(car.stock - item.quantity, 0);
          car.stock = newStock;
          await car.save();
        }
      }
    }
  }

  return verifiedPayment;
};

// Get All Orders
const allOrdersDetails = async (query:Record<string,any>) => {

  const orderQuery = new QueryBuilder(Order.find().populate({
    path: "cars.car", // Make sure the field matches your schema
    model: "Car", // Ensure it matches your Mongoose model name
    select: "brand model price stock imageUrl", // Only include 
  }),query).filter()
  .sort()
  .paginate()
  .fields()
  .search(orderSearchableFields)

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return {
    result,
    meta
  };
};

// Get a Specific Order
const oneOrderDetails = async (id: string) => {
  const result = await Order.findById(id).populate('car');
  return result;
};


const deleteOrder = async(orderId:string)=>{

  const result = await Order.findByIdAndDelete(orderId)
  return result

}


const orderRevenue = async () => {
  const result = await Order.aggregate([
    { $group: { _id: '$Order._id', totalRevenue: { $sum: '$totalPrice' } } },
    { $project: { totalRevenue: 1 } },
  ]);
  return result;
};

export const OrderServices = {
  orderACar,
  orderRevenue,
  allOrdersDetails,
  oneOrderDetails,
  verifyPayment,
  deleteOrder
};
