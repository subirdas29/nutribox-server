
import httpStatus from 'http-status';

import { CarServices } from './car.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';



// Create a CarController
const createCarController = catchAsync(async (req, res) => {

  const result = await CarServices.createCar( req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Car is created successfully',
    data: result,
  });
});

// Get All CarsController
const getAllCarController = catchAsync(async (req, res) => {


  

  const query = req.query
  const result = await CarServices.allCarsDetails(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cars fetched successfully",
    meta: result.meta,
    data: result.result,
  });
  
});


// Get One CarController
const oneCarDetailsController =
catchAsync(async (req, res) => {
  const carId = req.params.carId|| req.body._id;
  const result = await CarServices.oneCarDetails(carId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car fetched successfully",
    data: result,
  });
});



// Update a CarController
const carUpdateController = catchAsync(async (req, res) => {
  const carId = req.params.carId;
  const carData = req.body;
  const result = await CarServices.carUpdate(carId, carData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});


// Delete CarController
const carDeleteController = 

catchAsync(async (req, res) => {
  const {carId} = req.params;
  
  const result = await CarServices.carDelete(carId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car deleted successfully",
    data: result,
  });
});

export const CarController = {
  createCarController,
  getAllCarController,
  oneCarDetailsController,
  carUpdateController,
  carDeleteController,
};
