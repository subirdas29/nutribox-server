import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import config from '../../config';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access Token is retrieved successfully!',
    data: result,
  });
});



const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;


  const result = await AuthServices.changePassword(req.user, passwordData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword
};
