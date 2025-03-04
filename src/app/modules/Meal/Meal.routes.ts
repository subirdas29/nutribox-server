import express from 'express';
import { MealController } from './Meal.controller';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';






const router = express.Router();

router.post('/menu',
    auth(USER_ROLES.Meal_Provider), 
    MealController.mealController);

router.get('/meals', MealController.getAllMealsController);

export const MealRoutes = router;

