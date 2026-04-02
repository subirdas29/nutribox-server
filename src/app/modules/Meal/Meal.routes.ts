import express from 'express';
import { MealController } from './Meal.controller';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';






const router = express.Router();

router.post('/menu',auth(USER_ROLES.mealprovider),MealController.mealController);

router.get('/meals', MealController.getAllMealsController);

router.get('/meals/mymeals',auth(USER_ROLES.mealprovider), MealController.getMyMeal);
router.get('/meals/:mealId', MealController.getSingleMeal);
router.patch('/meals/update/:mealId', auth(USER_ROLES.mealprovider), MealController.updateMealController);


export const MealRoutes = router;

