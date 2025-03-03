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
const createOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield order_service_1.OrderServices.orderACar(email, req.body, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: result,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Order verified successfully',
        data: result,
    });
}));
// Get All CarsController
const getAllOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield order_service_1.OrderServices.allOrdersDetails(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
// Get One CarController
const oneOrderDetailsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const result = yield order_service_1.OrderServices.oneOrderDetails(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Car fetched successfully",
        data: result,
    });
}));
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderServices.deleteOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order cancelled successfully',
        data: result,
    });
}));
// Calculate Revenue Controller
const ordersRevenueController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.orderRevenue();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Revenue calculated successfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrderController,
    verifyPayment,
    ordersRevenueController,
    getAllOrderController,
    oneOrderDetailsController,
    deleteOrder
};
