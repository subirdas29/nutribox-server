
import QueryBuilder from '../../builder/QueryBuilder';
// import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { carSearchableFields } from './car.constant';
import { TCar } from './car.interface';
import { Car } from './car.model';

//Create a Car
const createCar = async ( carData: TCar) => {
  
  const result = await Car.create(carData);
  return result;
};

// Get All Cars
const allCarsDetails = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(
    Car.find({ isDeleted: { $ne: true } }), 
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(carSearchableFields);

  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();

  return {
    result,
    meta,
  };
};


// Get a Specific Car
const oneCarDetails = async (id: string) => {
  const result = await Car.findById(id);
  if (!result) {
    throw { name: 'NotFoundError', message: 'Car not found' };
  }
  return result;
};

// Update a Specific Car
const carUpdate = async (id: string, data: Partial<TCar>) => {
  const result = await Car.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!result) {
    throw { name: 'NotFoundError', message: 'Car not found' };
  }
  return result;
};

// Delete a Car
const carDelete = async (id: string) => {

  const carId = await Car.findById(id)

  if (!carId) {
    throw { name: 'NotFoundError', message: 'Car not found' };
  }

  const result = await Car.findByIdAndUpdate(id,
    {
      isDeleted:'true'
    },
    {
      new:true
    }
  )
 
  return result;
};

export const CarServices = {
  createCar,
  allCarsDetails,
  oneCarDetails,
  carUpdate,
  carDelete,
};
