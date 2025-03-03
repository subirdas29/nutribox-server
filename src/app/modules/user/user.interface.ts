import { Model, Types } from 'mongoose';
import { USER_ROLES } from './user.constant';

export type TMyOrders = {
  orders: Types.ObjectId;
  isDeleted: boolean;
};

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole; 
  phone?: string;
  isDeleted?: boolean;
  imageUrl?: string;
  address?: string;
  city?: string;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isThePasswordMatched(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isUserExist(email: string): Promise<TUser>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLES;
