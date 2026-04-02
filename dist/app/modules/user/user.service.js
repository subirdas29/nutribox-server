"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_model_1 = __importDefault(require("../order/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const MealProvider_model_1 = __importDefault(require("../MealProvider/MealProvider.model"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Transaction-1: Create Meal
        const userCreate = yield user_model_1.User.create([payload], { session });
        if (!userCreate.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        if (((_a = userCreate[0]) === null || _a === void 0 ? void 0 : _a.role) === 'mealprovider') {
            const userId = userCreate[0]._id;
            // Transaction-2
            const mealProviderData = yield MealProvider_model_1.default.create([{ userId }], { session });
            if (!mealProviderData) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add Meal Provider Data');
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        return userCreate;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to create user');
    }
});
// Get All Cars
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields()
        .search(user_constant_1.userSearchableFields);
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return {
        result,
        meta
    };
});
const getMyOrder = (email, query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(order_model_1.default.find({ email: email })
        .populate({
        path: "cars.car", // Make sure the field matches your schema
        model: "Car", // Ensure it matches your Mongoose model name
        select: "brand model price stock imageUrl", // Only include necessary fields
    }), query)
        .filter()
        .sort()
        .paginate()
        .fields()
        .search(user_constant_1.userSearchableFields);
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return {
        result,
        meta,
    };
});
const getAUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not Found');
    }
    return result;
});
const getMe = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'mealprovider') {
        result = yield user_model_1.User.findOne({ email });
    }
    if (role === 'customer') {
        result = yield user_model_1.User.findOne({ email });
    }
    return result;
});
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
const profileData = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found!');
    }
    if (user.isDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Your Account is Deleted!');
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email }, data, { new: true });
    return result;
});
exports.UserServices = {
    registerUser,
    getAllUsers,
    getMe,
    getMyOrder,
    getAUser,
    // blockUser,
    // unblockUser,
    profileData
};
