"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Meal_controller_1 = require("./Meal.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/menu', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), Meal_controller_1.MealController.mealController);
router.get('/meals', Meal_controller_1.MealController.getAllMealsController);
router.get('/meals/mymeals', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), Meal_controller_1.MealController.getMyMeal);
router.get('/meals/:mealId', Meal_controller_1.MealController.getSingleMeal);
router.patch('/meals/update/:mealId', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), Meal_controller_1.MealController.updateMealController);
exports.MealRoutes = router;
