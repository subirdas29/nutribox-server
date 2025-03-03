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
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const order_constant_1 = require("./order.constant");
const order_model_1 = require("./order.model");
const car_model_1 = require("../car/car.model");
const order_utils_1 = require("./order.utils");
const orderACar = (email, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (yield user_model_1.User.findOne({ email: email }));
    if (user.status === 'blocked') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Your Account is Deactivate by admin!');
    }
    if ((user === null || user === void 0 ? void 0 : user.isDeleted) === true) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Your Account is Deleted !');
    }
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.cars) === null || _a === void 0 ? void 0 : _a.length))
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Order is not specified");
    const cars = payload.cars;
    let totalPrice = 0;
    const carDetails = yield Promise.all(cars.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const car = yield car_model_1.Car.findById(item.car);
        if (!car) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car Not Found");
        }
        if (car.stock === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Sorry, the car you selected is currently out of stock. Please choose another car or check back later.");
        }
        const subtotal = car ? (car.price || 0) * item.quantity : 0;
        totalPrice += subtotal;
        return item;
    })));
    let order = yield order_model_1.Order.create({
        email,
        user,
        cars: carDetails,
        totalPrice,
    });
    // console.log(order)
    // payment integration
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: "BDT",
        customer_name: user.name,
        customer_address: user.address,
        customer_email: user.email,
        customer_phone: user.phone,
        customer_city: user.city,
        client_ip,
    };
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus
            },
        });
    }
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        const order = yield order_model_1.Order.findOne({ "transaction.id": order_id });
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        // Update the order status and transaction details
        yield order_model_1.Order.findOneAndUpdate({ "transaction.id": order_id }, {
            "transaction.bank_status": verifiedPayment[0].bank_status,
            "transaction.sp_code": verifiedPayment[0].sp_code,
            "transaction.sp_message": verifiedPayment[0].sp_message,
            "transaction.transactionStatus": verifiedPayment[0].transaction_status,
            "transaction.method": verifiedPayment[0].method,
            "transaction.date_time": verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == "Success"
                ? "Paid"
                : verifiedPayment[0].bank_status == "Failed"
                    ? "Pending"
                    : verifiedPayment[0].bank_status == "Cancel"
                        ? "Cancelled"
                        : "",
        });
        // Update car stock if the payment is successful
        if (verifiedPayment[0].bank_status === 'Success') {
            for (const item of order.cars) {
                const car = yield car_model_1.Car.findById(item.car);
                if (car) {
                    const newStock = Math.max(car.stock - item.quantity, 0);
                    car.stock = newStock;
                    yield car.save();
                }
            }
        }
    }
    return verifiedPayment;
});
// Get All Orders
const allOrdersDetails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find().populate({
        path: "cars.car", // Make sure the field matches your schema
        model: "Car", // Ensure it matches your Mongoose model name
        select: "brand model price stock imageUrl", // Only include 
    }), query).filter()
        .sort()
        .paginate()
        .fields()
        .search(order_constant_1.orderSearchableFields);
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        result,
        meta
    };
});
// Get a Specific Order
const oneOrderDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id).populate('car');
    return result;
});
const deleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndDelete(orderId);
    return result;
});
const orderRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.aggregate([
        { $group: { _id: '$Order._id', totalRevenue: { $sum: '$totalPrice' } } },
        { $project: { totalRevenue: 1 } },
    ]);
    return result;
});
exports.OrderServices = {
    orderACar,
    orderRevenue,
    allOrdersDetails,
    oneOrderDetails,
    verifyPayment,
    deleteOrder
};
