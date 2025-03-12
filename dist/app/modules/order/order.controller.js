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
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
// Create Order Controller
const orderMealController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = req.user;
    const result = yield order_service_1.OrderServices.orderMeal(req.body, email, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: result,
    });
}));
const getMyOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { email } = req.user;
    const result = yield order_service_1.OrderServices.getMyOrder(query, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Orders fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
//mealprovider order
const getAllOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { email } = req.user;
    const result = yield order_service_1.OrderServices.getAllOrder(query, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Orders fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
// const verifyPayment = catchAsync(async (req, res) => {
//   const result = await OrderServices.verifyPayment(req.query.order_id as string);
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Order verified successfully',
//     data: result,
//   });
// });
// Get All CarsController
// const getAllOrderController = catchAsync(async (req, res) => {
//   const query = req.query
//   const result = await OrderServices.allOrdersDetails(query);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Orders fetched successfully",
//     meta:result.meta,
//     data: result.result,
//   });
// });
// Get One CarController
const oneOrderDetailsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const result = yield order_service_1.OrderServices.oneOrderDetails(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
}));
const updateOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: payload, params: { orderId }, } = req;
    const { email } = req.user;
    const result = yield order_service_1.OrderServices.updateOrder(orderId, payload, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order updated successfully",
        data: result,
    });
}));
// const deleteOrder =catchAsync(async (req, res) => {
//   const {orderId} = req.params
//   const result = await OrderServices.deleteOrder(orderId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order cancelled successfully',
//     data: result,
//   });
// });
// Calculate Revenue Controller
exports.OrderController = {
    orderMealController,
    updateOrderController,
    getMyOrder,
    getAllOrder,
    // verifyPayment,
    // ordersRevenueController,
    // getAllOrderController,
    oneOrderDetailsController,
    // deleteOrder
};
