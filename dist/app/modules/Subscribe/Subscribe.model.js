"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribe = void 0;
const mongoose_1 = require("mongoose");
const SubscribeSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
}, { timestamps: true });
exports.Subscribe = (0, mongoose_1.model)("Subscribe", SubscribeSchema);
