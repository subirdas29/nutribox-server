import express from 'express';
import { CarController } from './car.controller';
import { CarValidation } from './car.validation';
import validateRequest from '../../middlewares/validateRequest';
// import { upload } from '../../utils/sendImageToCloudinary';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post('/',
  auth(USER_ROLES.admin),
    validateRequest(CarValidation.carSchema), CarController.createCarController);

router.get('/',
  CarController.getAllCarController);

router.get('/:carId',
  auth(USER_ROLES.admin,USER_ROLES.user),
   CarController.oneCarDetailsController);

router.put('/:carId',
  auth(USER_ROLES.admin),
  validateRequest(CarValidation.updateCarSchema),
  CarController.carUpdateController);

router.patch('/delete/:carId', 
  auth(USER_ROLES.admin),
  CarController.carDeleteController);

export const CarRoutes = router;
