"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const car_routes_1 = require("../modules/car/car.routes");
const order_routes_1 = require("../modules/order/order.routes");
const auth_route_1 = require("../modules/auth/auth.route");
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
        path: '/cars',
        route: car_routes_1.CarRoutes,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
