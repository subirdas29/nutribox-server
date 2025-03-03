import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import httpStatus from 'http-status';

const registerUserController = catchAsync(async (req, res) => {
  const result = await UserServices.registerUser(req.body);


  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: httpStatus.CREATED,
    data: result
  });
});

const getAllUsers = catchAsync(async(req,res)=>{

  const query = req.query



  const result = await UserServices.getAllUsers(query)



  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.result,
  });
})


const getMyOrder = catchAsync(async (req, res) => {
  const {email} = req.user;
  const query = req.query
  const result = await UserServices.getMyOrder(email,query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Order is retrieved successfully',
    meta:result.meta,
    data: result.result,
  });
});

const getAUser =catchAsync(async (req, res) => {
  
  const {userId} = req.params 

  const result = await UserServices.getAUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role } = req.user;


  const result = await UserServices.getMe(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});


// const blockUser = catchAsync(async (req, res) => {
  
//   const {userId} = req.params


//   const result = await UserServices.blockUser(userId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User is blocked successfully',
//     data: result,
//   });
// });

// const unblockUser = catchAsync(async (req, res) => {
  
//   const {userId} = req.params


//   const result = await UserServices.unblockUser(userId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User is unblocked successfully',
//     data: result,
//   });
// });


const profileData = catchAsync(async (req, res) => {
  const { email } = req.user;
  const profileDetails = req.body;
  const result = await UserServices.profileData(email,profileDetails);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});


export const UserController = {
  registerUserController,
  getAllUsers,
  getMyOrder,
  getAUser,
  getMe,
  // blockUser,
  // unblockUser,
  profileData
};
