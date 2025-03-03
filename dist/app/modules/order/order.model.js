"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_constant_1 = require("./order.constant");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cars: [
        {
            car: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Car",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        // required: opt,
    },
    status: {
        type: String,
        enum: order_constant_1.statusEnum,
        default: "Pending",
    },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
