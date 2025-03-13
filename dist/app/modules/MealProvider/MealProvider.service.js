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
exports.mealProviderServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Meal_model_1 = __importDefault(require("../Meal/Meal.model"));
const user_model_1 = require("../user/user.model");
const MealProvider_model_1 = __importDefault(require("./MealProvider.model"));
const http_status_1 = __importDefault(require("http-status"));
const mealProvider = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const availableMeals = yield Meal_model_1.default.find({ mealProvider: user === null || user === void 0 ? void 0 : user._id }).select("_id");
    const providerDetails = Object.assign(Object.assign({}, payload), { userId: user === null || user === void 0 ? void 0 : user._id, availableMeals: availableMeals });
    const result = yield MealProvider_model_1.default.create(providerDetails);
    return result;
});
const getAllMealProvider = (query, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const mealQuery = new QueryBuilder_1.default(MealProvider_model_1.default.find({ userId: user === null || user === void 0 ? void 0 : user._id }).populate("userId").populate("availableMeals"), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    // .search(userSearchableFields)
    const result = yield mealQuery.modelQuery;
    const meta = yield mealQuery.countTotal();
    return {
        result,
        meta
    };
});
exports.mealProviderServices = {
    mealProvider,
    getAllMealProvider
};
