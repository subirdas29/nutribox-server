import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { contactService } from "./Contact.service";

const createContactController = catchAsync(async (req, res) => {

    // const {email} = req.user;
    const result = await contactService.createContact(
      req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Thank you for reaching out! Your message has been received successfully.',
      data: result,
    });
  });

  export const ContactController = {
    createContactController
  };