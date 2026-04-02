"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validationRequest from '../../middlewares/validateRequest';
const user_controller_1 = require("./user.controller");
// import { userValidation } from './user.validation';
const user_constant_1 = require("./user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
;
const router = express_1.default.Router();
router.post('/register', 
// validationRequest(userValidation.registerValidationSchema),
user_controller_1.UserController.registerUserController);
router.patch('/profile-data', (0, auth_1.default)(user_constant_1.USER_ROLES.customer, user_constant_1.USER_ROLES.mealprovider), 
// validationRequest(userValidation.updateProfileSchema),
user_controller_1.UserController.profileData);
router.get('/my-data', (0, auth_1.default)(user_constant_1.USER_ROLES.customer, user_constant_1.USER_ROLES.mealprovider), 
// validationRequest(userValidation.updateProfileSchema),
user_controller_1.UserController.getMe);
// router.get(
//   '/all-users',
//   auth(USER_ROLES.admin),
//   UserController.getAllUsers,
// );
// router.get(
//   '/:userId',
//   auth(USER_ROLES.admin),
//   UserController.getAUser,
// );
// router.get(
//   '/me/details',
//   auth( USER_ROLES.admin, USER_ROLES.user),
//   UserController.getMe,
// );
// router.get(
//   '/my-order/details',
//   auth( USER_ROLES.admin, USER_ROLES.user),
//   UserController.getMyOrder,
// )
// router.patch(
//   '/block-user/:userId',
//   auth(USER_ROLES.admin),
//   UserController.blockUser,
// )
// router.patch(
//   '/unblock-user/:userId',
//   auth(USER_ROLES.admin),
//   UserController.unblockUser,
// )
exports.UserRoutes = router;
