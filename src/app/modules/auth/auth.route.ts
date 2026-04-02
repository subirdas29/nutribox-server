import express from 'express';

// import validateRequest from '../../middlewares/validateRequest';
// import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  // validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);


// router.post(
//   '/change-password',
//   // auth(USER_ROLES.admin,USER_ROLES.user),
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// );

router.post(
  '/refresh-token',
    // validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
