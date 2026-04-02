/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';

import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import Order from '../order/order.model';
import mongoose from 'mongoose';
import MealProvider from '../MealProvider/MealProvider.model';

const registerUser = async (payload: TUser) => {

  const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
    
      // Transaction-1: Create Meal
      const userCreate = await User.create([payload], { session });
     
      if (!userCreate.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }
  
    
      if (userCreate[0]?.role === 'mealprovider') {
        const userId = userCreate[0]._id
        // Transaction-2
        const mealProviderData = await MealProvider.create([{userId}],{session})
    
  
        if (!mealProviderData) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add Meal Provider Data');
        }
      }
  
      await session.commitTransaction();
      await session.endSession();
  
      return userCreate;
    } catch (err: any) {
   
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Failed to create user');
    }

};

// Get All Cars
const getAllUsers = async (query:Record<string,unknown>) => {


  

  const userQuery = new QueryBuilder(User.find(),query)
  .filter()
  .sort()
  .paginate()
  .fields()
  .search(userSearchableFields)

  const result = await userQuery.modelQuery
  const meta = await userQuery.countTotal()
  return {
    result,
    meta
  };
};

const getMyOrder = async (email: string, query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    Order.find({ email: email })
      .populate({
        path: "cars.car", // Make sure the field matches your schema
        model: "Car", // Ensure it matches your Mongoose model name
        select: "brand model price stock imageUrl", // Only include necessary fields
      }),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(userSearchableFields);

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();


  return {
    result,
    meta,
  };
};


const getAUser = async (id:string) => {
  const result = await User.findById(id)

  if(!result)
  {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found')
  }
  return result;
};


const getMe = async (email: string, role: string) => {
  let result = null;

  if (role === 'mealprovider') {
    result = await User.findOne({ email})
  }

  if (role === 'customer') {
    result = await User.findOne({ email })
  }

  return result;
};


// const blockUser = async(userId:string)=>{

//   const user = await User.findById(userId) as TUser

//   if(user.role==='admin'){
//     throw new AppError(httpStatus.BAD_REQUEST, 'you are admin!')
//   }

//   if(user.status === 'blocked'){
//     throw new AppError(httpStatus.BAD_REQUEST, 'User Already Blocked!')
//   }

//   const result = await User.findByIdAndUpdate(userId,
//     {
//       status:'blocked'
//     },
//     {
//       new:true
//     }
//   )
 
//   return result
// }
// const unblockUser = async(userId:string)=>{

//   const user = await User.findById(userId) as TUser

//   if(user.role==='admin'){
//     throw new AppError(httpStatus.BAD_REQUEST, 'you are admin!')
//   }

//   const result = await User.findByIdAndUpdate(userId,
//     {
//       status:'in-progress'
//     },
//     {
//       new:true
//     }
//   )
 
//   return result
// }


const profileData = async (email: string, data: Partial<TUser>) => {

  

  const user = await User.findOne({email})
  

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!')
  }

  if(user.isDeleted=== true){
    throw new AppError(httpStatus.NOT_FOUND, 'Your Account is Deleted!')
  }

 
  const result = await User.findOneAndUpdate({email},data, { new: true }
    );

 
  return result;
};

export const UserServices = {
  registerUser,
  getAllUsers,
  getMe,
  getMyOrder,
  getAUser,
  // blockUser,
  // unblockUser,
  profileData
};
