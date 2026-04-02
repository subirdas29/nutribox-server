"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const MealProvider_controller_1 = require("./MealProvider.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/meal-provider', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), MealProvider_controller_1.MealProviderController.mealProviderController);
router.get('/meal-provider/mydata', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), MealProvider_controller_1.MealProviderController.getAllMealsController);
exports.ProvidersRoutes = router;
