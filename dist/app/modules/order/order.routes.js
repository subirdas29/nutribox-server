"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLES.customer), order_controller_1.OrderController.orderMealController);
router.get("/verify", order_controller_1.OrderController.verifyPayment);
router.get('/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLES.customer, user_constant_1.USER_ROLES.mealprovider), order_controller_1.OrderController.oneOrderDetailsController);
router.get('/:orderId/meal/:mealId', order_controller_1.OrderController.oneOrderMealController);
router.patch('/orderdetails/:orderId/meal/:mealId', (0, auth_1.default)(user_constant_1.USER_ROLES.customer, user_constant_1.USER_ROLES.mealprovider), order_controller_1.OrderController.updateOrderController);
router.get('/myorder/alldata', (0, auth_1.default)(user_constant_1.USER_ROLES.customer), order_controller_1.OrderController.getMyOrder);
router.get('/allorder/mealprovider', (0, auth_1.default)(user_constant_1.USER_ROLES.mealprovider), order_controller_1.OrderController.getAllOrderOfMealProvider);
exports.OrderRoutes = router;
