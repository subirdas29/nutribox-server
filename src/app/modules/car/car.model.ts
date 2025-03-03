import { model, Schema } from 'mongoose';
import { CarModel, TCar } from './car.interface';
import { Category } from './car.constant';

const carSchema = new Schema<TCar, CarModel>(
  {
    
    brand: {
      type: String,
      required: true,
    
    },
    model: {
      type: String,
      required: true,
     
    },
  
    price: {
      type: Number,
      required: true,
    
    },
    category: {
      type: String,
      // required:true,
      enum: Category
    },
    description: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  
    imageUrl: { type: String },
    isStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

carSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Partial<TCar>;

  if (update.stock !== undefined) {
    if (update.stock > 0) {
      update.isStock = true;
    } else {
      update.isStock = false;
    }
  }
  next();
});

carSchema.statics.updateCar = async function (carId: string, stock: number) {
  const car = await this.findById(carId);

  if (!car) {
    throw new Error('Car not found');
  }

  if (car.stock < stock) {
    throw new Error('Insufficient stock for this car');
  }

  car.stock = car.stock - stock;

  if (car.stock === 0) {
    car.isStock = false;
  }

  await car.save();

  return car;
};

export const Car = model<TCar, CarModel>('Car', carSchema);
