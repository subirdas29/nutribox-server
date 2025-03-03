import { z } from "zod";
import { TCategory } from "./car.interface"

export const Category:TCategory[] = [
    'Sedan' ,
     'SUV' , 
     'Truck' , 
     'Coupe' , 
     'Convertible'
]

export const carSearchableFields = ['brand','model','year','price','category','description']

export const categoryEnum = z.enum(["SUV", "Sedan", "Truck", "Hatchback", "Coupe","Convertible"]);