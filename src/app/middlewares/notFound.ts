/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
// import status from "http-status";

// ae notFound error ta sudu matro route path api vul dile dekhabe (mane jei path ta exist kore na ta dile sudu ae error ta show korbe)

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API NOT FOUND !!',
    error: '',
  });
};

export default notFound;
