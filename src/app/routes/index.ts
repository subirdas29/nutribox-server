import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

import { OrderRoutes } from '../modules/order/order.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProvidersRoutes } from '../modules/MealProvider/MealProvider.routes';
import { MealRoutes } from '../modules/Meal/Meal.routes';
import { ContactRoutes } from '../modules/Contact/Contact.routes';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },

  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/allmeals',
    route:MealRoutes ,
  },
  {
    path: '/contact',
    route:ContactRoutes ,
  },
  {
    path:'/provider',
    route:ProvidersRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
