"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryEnum = exports.carSearchableFields = exports.Category = void 0;
const zod_1 = require("zod");
exports.Category = [
    'Sedan',
    'SUV',
    'Truck',
    'Coupe',
    'Convertible'
];
exports.carSearchableFields = ['brand', 'model', 'year', 'price', 'category', 'description'];
exports.categoryEnum = zod_1.z.enum(["SUV", "Sedan", "Truck", "Hatchback", "Coupe", "Convertible"]);
