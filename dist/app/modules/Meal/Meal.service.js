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
exports.mealService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const Meal_model_1 = __importDefault(require("./Meal.model"));
const http_status_1 = __importDefault(require("http-status"));
const MealProvider_model_1 = __importDefault(require("../MealProvider/MealProvider.model"));
const createMeal = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    const mealProviderId = yield MealProvider_model_1.default.findOne({ userId: user === null || user === void 0 ? void 0 : user._id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const providerMeal = Object.assign(Object.assign({}, payload), { mealProvider: mealProviderId === null || mealProviderId === void 0 ? void 0 : mealProviderId._id });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Transaction-1: Create Meal
        const mealCreate = yield Meal_model_1.default.create([providerMeal], { session });
        if (!mealCreate || mealCreate.length === 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Firstly Failed to create meal');
        }
        if (mealCreate[0].available) {
            // Transaction-2
            const newMeal = yield MealProvider_model_1.default.findOneAndUpdate({ _id: mealCreate[0].mealProvider }, { $push: { availableMeals: mealCreate[0]._id } }, { new: true, session });
            if (!newMeal) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add as availableMeals');
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        return mealCreate;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to create meal');
    }
});
//all meals for everyone
const getAllMeals = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const { minPrice, maxPrice, categories, mealName, iStock, ratings, ...pQuery } = query;
    const filter = {
        isDeleted: false,
        available: true,
    };
    // Filter by mealName
    // if (mealName) {
    //   const mealArray = typeof mealName === 'string'
    //     ? mealName.split(',')
    //     : Array.isArray(mealName)
    //       ? mealName
    //       : [mealName];
    //   filter.name = { $in: mealArray };
    // }
    // Filter by categories
    // if (categories) {
    //   const categoryArray = typeof categories === 'string'
    //     ? categories.split(',')
    //     : Array.isArray(categories)
    //       ? categories
    //       : [categories];
    //   filter.category = { $in: categoryArray };
    // }
    // Filter by ratings
    // if (ratings) {
    //   const ratingArray = typeof ratings === 'string'
    //     ? ratings.split(',')
    //     : Array.isArray(ratings)
    //       ? ratings
    //       : [ratings];
    //   filter.averageRating = { $in: ratingArray.map(Number) };
    // }
    const mealQuery = new QueryBuilder_1.default(Meal_model_1.default.find(filter).populate({
        path: 'mealProvider',
        populate: { path: 'userId' }
    }), query)
        .search(['name', 'category'])
        .filter()
        .sort()
        .paginate()
        .fields();
    // .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
    const result = yield mealQuery.modelQuery.lean();
    const meta = yield mealQuery.countTotal();
    return {
        result,
        meta,
    };
});
//all meals of provider own
const getMyMeal = (email, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email }).select('_id');
    const mealProvider = yield MealProvider_model_1.default.findOne({ userId: user }).select('_id');
    const meal = yield Meal_model_1.default.find({
        mealProvider
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!mealProvider) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized for that meal");
    }
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    const mealQuery = new QueryBuilder_1.default(Meal_model_1.default.find({ mealProvider, isDeleted: false }).populate("mealProvider"), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield mealQuery.modelQuery;
    const meta = yield mealQuery.countTotal();
    return {
        result,
        meta
    };
});
const getSingleMeal = (mealId) => __awaiter(void 0, void 0, void 0, function* () {
    const meal = yield Meal_model_1.default.findById(mealId);
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Meal not found');
    }
    if (meal.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Meal is deleted');
    }
    const result = yield Meal_model_1.default.findById(mealId)
        .populate({
        path: 'mealProvider',
        populate: {
            path: 'userId',
        },
    });
    return result;
});
//update Meal
const updateMeal = (mealId, payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email }).select('_id');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const mealProvider = yield MealProvider_model_1.default.findOne({ userId: user }).select('_id');
    if (!mealProvider) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized for that meal");
    }
    const mealData = yield Meal_model_1.default.findById(mealId);
    if (!mealData || String(mealData.mealProvider) !== String(mealProvider._id)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not the owner of this meal");
    }
    if (mealData.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "The meal you are trying to access has already been deleted");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Transaction-1: Create Meal
        const updateMeal = yield Meal_model_1.default.findByIdAndUpdate(mealId, payload, { session, new: true });
        if (!updateMeal) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create meal');
        }
        // Handle availableMeals updates
        if (payload.isDeleted === true) {
            // If meal is marked as deleted, remove it from availableMeals
            yield MealProvider_model_1.default.findOneAndUpdate({ _id: mealProvider }, { $pull: { availableMeals: mealId } }, // Removes if exists
            { session });
        }
        else if (payload.available !== undefined && payload.available !== mealData.available) {
            // If availability changes, update availableMeals accordingly
            if (payload.available) {
                yield MealProvider_model_1.default.findOneAndUpdate({ _id: mealProvider }, { $addToSet: { availableMeals: mealId } }, // Prevents duplicate addition
                { session });
            }
            else {
                yield MealProvider_model_1.default.findOneAndUpdate({ _id: mealProvider }, { $pull: { availableMeals: mealId } }, // Removes if exists
                { session });
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        return updateMeal;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to update meal');
    }
});
exports.mealService = {
    createMeal,
    getAllMeals,
    getMyMeal,
    getSingleMeal,
    updateMeal,
};
