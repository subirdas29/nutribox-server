import express from 'express';
import { MealProviderController } from './MealProvider.controller';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';





const router = express.Router();

router.post('/meal-provider',
    auth(USER_ROLES.Meal_Provider), 
    MealProviderController.mealProviderController);

router.get('/meal-provider', MealProviderController.getAllMealsController);

export const ProvidersRoutes = router;

