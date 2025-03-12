"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const order_routes_1 = require("../modules/order/order.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const MealProvider_routes_1 = require("../modules/MealProvider/MealProvider.routes");
const Meal_routes_1 = require("../modules/Meal/Meal.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/providers',
        route: Meal_routes_1.MealRoutes,
    },
    {
        path: '/provider',
        route: MealProvider_routes_1.ProvidersRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
