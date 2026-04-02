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
exports.MealController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const Meal_service_1 = require("./Meal.service");
const http_status_1 = __importDefault(require("http-status"));
const mealController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield Meal_service_1.mealService.createMeal(req.body, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Meals Created successfully',
        data: result,
    });
}));
const getAllMealsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield Meal_service_1.mealService.getAllMeals(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meals fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
const getMyMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { email } = req.user;
    const result = yield Meal_service_1.mealService.getMyMeal(email, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meals fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
const getSingleMeal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mealId } = req.params;
    const result = yield Meal_service_1.mealService.getSingleMeal(mealId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meal retrieved successfully",
        data: result,
    });
}));
const updateMealController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: payload, params: { mealId }, } = req;
    const { email } = req.user;
    const result = yield Meal_service_1.mealService.updateMeal(mealId, payload, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Meal updated successfully",
        data: result,
    });
}));
exports.MealController = {
    mealController,
    getAllMealsController,
    updateMealController,
    getSingleMeal,
    getMyMeal
};
