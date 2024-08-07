import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppErrorHandler from '../shared/error-handling';

interface ResponseData {
  success: boolean;
  statusCode: number;
  errors: {
    message: string;
    details?: Array<{ field: string; message: string; location: string }>;
  };
  operational?: boolean;
  requestId?: string;
  stack?: string;
}

export default function globalErrorHandler(expressApp: Application) {
  expressApp.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error && typeof error === 'object') {
      if (error.operational === undefined || error.operational === null) {
        error.operational = true;
      }
    }

    const errorHandler = new AppErrorHandler();
    errorHandler.handleError(error);

    const responseData: ResponseData = {
      success: error.success || false,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error.errors || { message: 'An unexpected error occurred' }, // Use the new structure
      operational: error.operational,
      requestId: res.get('X-Request-Id'),
    };

    // Check if NODE_ENV is set to 'development'
    if (process.env.NODE_ENV?.trim() === 'development') {
      // Include stack trace in response
      responseData.stack = error.stack;
    }

    res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responseData);
  });
}
