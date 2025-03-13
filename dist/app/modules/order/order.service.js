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
exports.OrderServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Meal_model_1 = __importDefault(require("../Meal/Meal.model"));
const MealProvider_model_1 = __importDefault(require("../MealProvider/MealProvider.model"));
const user_model_1 = require("../user/user.model");
const order_model_1 = __importDefault(require("./order.model"));
const http_status_1 = __importDefault(require("http-status"));
const orderMeal = (payload, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user (customer)
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Ensure the user is a customer
    if (role !== "customer") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You must have a customer role to place an order");
    }
    // Find the meal
    const meal = yield Meal_model_1.default.findById(payload.mealId);
    if (!meal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
    }
    if (meal.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal is deleted");
    }
    if (!meal.available) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Meal is not available");
    }
    // Get the meal provider from the meal
    const mealProvider = yield MealProvider_model_1.default.findById(meal.mealProvider).select("_id");
    if (!mealProvider) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal provider not found");
    }
    // Prepare order data
    const orderData = Object.assign(Object.assign({}, payload), { customerId: user._id, mealProviderId: mealProvider._id, mealId: meal._id });
    // Create the order
    const result = yield order_model_1.default.create(orderData);
    return result;
});
//single order
const oneOrderDetails = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.findById(orderId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order is not found");
    }
    return result;
});
const getAllOrder = (query, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('_id');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const mealProvider = yield MealProvider_model_1.default.findOne({ userId: user }).select('_id');
    if (!mealProvider) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "mealProvider not found");
    }
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({ mealProviderId: mealProvider }).populate('customerId'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    // .search(userSearchableFields)
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        result,
        meta
    };
});
const getMyOrder = (query, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({
        customerId: user === null || user === void 0 ? void 0 : user._id
    }).populate('mealId').populate('mealProviderId'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    // .search(userSearchableFields)
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        result,
        meta
    };
});
const updateOrder = (orderId, payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return yield order_model_1.default.findByIdAndUpdate(orderId, payload, { new: true });
});
exports.OrderServices = {
    orderMeal,
    oneOrderDetails,
    updateOrder,
    getMyOrder,
    getAllOrder
};
