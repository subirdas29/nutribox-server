import express from 'express';
import validationRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { userValidation } from './user.validation';
import { USER_ROLES } from './user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validationRequest(userValidation.registerValidationSchema),
  UserController.registerUserController,
);

router.get(
  '/all-users',
  auth(USER_ROLES.admin),
  UserController.getAllUsers,
);

router.get(
  '/:userId',
  auth(USER_ROLES.admin),
  UserController.getAUser,
);

router.get(
  '/me/details',
  auth( USER_ROLES.admin, USER_ROLES.user),
  UserController.getMe,
);

router.get(
  '/my-order/details',
  auth( USER_ROLES.admin, USER_ROLES.user),
  UserController.getMyOrder,
)

router.patch(
  '/block-user/:userId',
  auth(USER_ROLES.admin),
  UserController.blockUser,
)
router.patch(
  '/unblock-user/:userId',
  auth(USER_ROLES.admin),
  UserController.unblockUser,
)

router.patch(
  '/profile-data',
  auth( USER_ROLES.admin, USER_ROLES.user),
  validationRequest(userValidation.updateProfileSchema),
  UserController.profileData,
)


export const UserRoutes = router;
