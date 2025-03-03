import express from 'express';
import { MealProviderController } from './provider.controller';





const router = express.Router();

router.post('/menu',
    // auth(USER_ROLES.customer), 
    MealProviderController.mealProviderController);


export const ProvidersRoutes = router;

