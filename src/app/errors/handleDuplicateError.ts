/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Regular expression to extract the value inside double quotes
  const match = err.message.match(/"([^"]*)"/);

  const errorMessage = match && match[1];
  const statusCode = 400;
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${errorMessage} is already exits`,
    },
  ];

  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleDuplicateError;
