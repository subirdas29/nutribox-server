import { Model } from 'mongoose';

export type TCategory = 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible'

export type TCar = {
  brand: string;
  model: string;
  price: number;
  category?: TCategory;
  description: string;
  stock: number;
  imageUrl?: string;
  isStock?: boolean | 'undefined';
  isDeleted?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface CarModel extends Model<TCar> {
  updateCar(carId: string, stock: number): Promise<TCar | null>;
}
