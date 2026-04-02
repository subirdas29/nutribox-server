"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const mongoose_1 = __importDefault(require("mongoose"));
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
    const allOrderMeals = payload.selectedMeals;
    yield Promise.all(allOrderMeals.map((meal) => __awaiter(void 0, void 0, void 0, function* () {
        const orderMeal = yield Meal_model_1.default.findById(meal.mealId);
        if (!orderMeal) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal not found");
        }
        if (orderMeal.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal is deleted");
        }
        if (!orderMeal.available) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Meal is not available");
        }
        return meal;
    })));
    // Get the meal provider from the meal
    yield Promise.all(allOrderMeals.map((provider) => __awaiter(void 0, void 0, void 0, function* () {
        const mealProviderData = yield MealProvider_model_1.default.findById(provider.mealProviderId).select("_id");
        if (!mealProviderData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal provider not found");
        }
    })));
    const allMealTotalPrice = allOrderMeals.reduce((sum, meal) => sum + meal.orderPrice, 0);
    const totalPrice = allMealTotalPrice + payload.deliveryCharge;
    // Create the order
    let order = yield order_model_1.default.create(Object.assign(Object.assign({}, payload), { customerId: user._id, totalPrice }));
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
        const order = yield order_model_1.default.findOne({ "transaction.id": order_id });
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
        }
        const paymentStatus = verifiedPayment[0].bank_status;
        let updatedMealStatus = "Pending";
        if (paymentStatus === "Success") {
            updatedMealStatus = "Pending";
        }
        else if (paymentStatus === "Failed") {
            updatedMealStatus = "Failed";
        }
        else {
            updatedMealStatus = "Cancelled";
        }
        // Update the order status and transaction details
        yield order_model_1.default.updateOne({ "transaction.id": order_id }, {
            $set: {
                "transaction.bank_status": verifiedPayment[0].bank_status,
                "transaction.sp_code": verifiedPayment[0].sp_code,
                "transaction.sp_message": verifiedPayment[0].sp_message,
                "transaction.transactionStatus": verifiedPayment[0].transaction_status,
                "transaction.method": verifiedPayment[0].method,
                "transaction.date_time": verifiedPayment[0].date_time,
                "selectedMeals.$[].status": updatedMealStatus,
            },
        });
        // console.log("Updated Meals:", updatedOrder?.selectedMeals);
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
//single Order with Common Delivery Address
const oneOrderMealDetails = (orderId, mealId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order is not found");
    }
    const selectedMeals = order.selectedMeals.find((meal) => { var _a; return meal && ((_a = meal._id) === null || _a === void 0 ? void 0 : _a.toString()) === mealId; });
    if (!selectedMeals) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal is not found");
    }
    const result = {
        _id: order._id,
        customerId: order.customerId,
        deliveryDate: order.deliveryDate,
        deliveryTime: order.deliveryTime,
        deliveryAddress: order.deliveryAddress,
        deliveryArea: order.deliveryArea,
        paymentMethod: order.paymentMethod,
        selectedMeals: [selectedMeals],
        transaction: order.transaction
    };
    return result;
});
const getAllOrderOfMealProvider = (query, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('_id').lean();
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Meal Provider not found");
    }
    const mealProvider = yield MealProvider_model_1.default.findOne({ userId: user }).select('_id').lean();
    if (!mealProvider) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "mealProvider not found");
    }
    const orderData = yield order_model_1.default.aggregate([
        {
            $unwind: '$selectedMeals'
        },
        {
            $match: { 'selectedMeals.mealProviderId': mealProvider === null || mealProvider === void 0 ? void 0 : mealProvider._id }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customerId"
            }
        },
        { $unwind: '$customerId' },
    ]);
    const result = orderData.map((item) => (Object.assign(Object.assign({}, item), { selectedMeals: [item.selectedMeals] })));
    return result;
});
const getMyOrder = (query, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({
        customerId: user === null || user === void 0 ? void 0 : user._id
    })
        .populate({
        path: "selectedMeals.mealId"
    }), query)
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange();
    // .search(userSearchableFields)
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        result,
        meta
    };
});
const updateOrder = (orderId, mealId, payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const order = yield order_model_1.default.findOne({ _id: orderId });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const orderMeal = yield order_model_1.default.findOne({
        'selectedMeals._id': new mongoose_1.default.Types.ObjectId(mealId)
    }).lean();
    if (!orderMeal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order Meal not found");
    }
    const updateFields = {};
    if (payload.deliveryDate)
        updateFields.deliveryDate = payload.deliveryDate;
    if (payload.deliveryTime)
        updateFields.deliveryTime = payload.deliveryTime;
    if (payload.deliveryAddress)
        updateFields.deliveryAddress = payload.deliveryAddress;
    if (payload.selectedMeals && payload.selectedMeals.length > 0) {
        const selectedMealUpdate = payload.selectedMeals[0];
        const result = yield order_model_1.default.updateOne({ _id: orderId, "selectedMeals._id": mealId }, {
            $set: Object.assign(Object.assign({}, updateFields), { "selectedMeals.$": Object.assign({}, selectedMealUpdate) }),
        });
        return result;
    }
    const result = yield order_model_1.default.findByIdAndUpdate(orderId, { $set: updateFields }, { new: true });
    return result;
});
exports.OrderServices = {
    orderMeal,
    oneOrderDetails,
    updateOrder,
    getMyOrder,
    getAllOrderOfMealProvider,
    verifyPayment,
    oneOrderMealDetails
};
