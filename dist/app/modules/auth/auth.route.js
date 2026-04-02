"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from '../../middlewares/validateRequest';
// import { AuthValidation } from './auth.validation';
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/login', 
// validateRequest(AuthValidation.loginValidationSchema),
auth_controller_1.AuthControllers.loginUser);
// router.post(
//   '/change-password',
//   // auth(USER_ROLES.admin,USER_ROLES.user),
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// );
router.post('/refresh-token', 
// validateRequest(AuthValidation.refreshTokenValidationSchema),
auth_controller_1.AuthControllers.refreshToken);
exports.AuthRoutes = router;
