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
const order_utils_1 = require("./order.utils");
const orderMeal = (payload, email, role, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
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
    let order = yield order_model_1.default.create(orderData);
    // payment integration
    const shurjopayPayload = {
        amount: payload.totalPrice,
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
        const order = yield order_model_1.default.findOne({ "transaction.id": order_id });
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        // Update the order status and transaction details
        yield order_model_1.default.findOneAndUpdate({ "transaction.id": order_id }, {
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
        // Update Meal stock if the payment is successful
        // if (verifiedPayment[0].bank_status === 'Success') {
        //   for (const item of order.cars) {
        //     const car = await Meal.findById(item.car);
        //     if (car) {
        //       const newStock = Math.max(car.stock - item.quantity, 0);
        //       car.stock = newStock;
        //       await car.save();
        //     }
        //   }
        // }
    }
    return verifiedPayment;
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
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({ mealProviderId: mealProvider }).populate('customerId').populate('mealId'), query)
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
    getAllOrder,
    verifyPayment
};
