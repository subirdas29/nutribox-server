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
exports.CarController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const car_service_1 = require("./car.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Create a CarController
const createCarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarServices.createCar(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Car is created successfully',
        data: result,
    });
}));
// Get All CarsController
const getAllCarController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield car_service_1.CarServices.allCarsDetails(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cars fetched successfully",
        meta: result.meta,
        data: result.result,
    });
}));
// Get One CarController
const oneCarDetailsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carId = req.params.carId || req.body._id;
    const result = yield car_service_1.CarServices.oneCarDetails(carId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Car fetched successfully",
        data: result,
    });
}));
// Update a CarController
const carUpdateController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carId = req.params.carId;
    const carData = req.body;
    const result = yield car_service_1.CarServices.carUpdate(carId, carData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Car updated successfully",
        data: result,
    });
}));
// Delete CarController
const carDeleteController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const result = yield car_service_1.CarServices.carDelete(carId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Car deleted successfully",
        data: result,
    });
}));
exports.CarController = {
    createCarController,
    getAllCarController,
    oneCarDetailsController,
    carUpdateController,
    carDeleteController,
};
