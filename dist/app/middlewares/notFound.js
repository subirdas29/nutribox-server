"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// import status from "http-status";
// ae notFound error ta sudu matro route path api vul dile dekhabe (mane jei path ta exist kore na ta dile sudu ae error ta show korbe)
const notFound = (req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'API NOT FOUND !!',
        error: '',
    });
};
exports.default = notFound;
