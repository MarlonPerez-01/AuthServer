import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MulterError } from 'multer';
import { config } from '../config/config';
import { logger } from '../config/logger';
import { ApiError } from '../helpers/ApiError';

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    error = new ApiError(StatusCodes.UNAUTHORIZED, 'El token ha expirado');
  }

  if (error instanceof MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE')
      error = new ApiError(StatusCodes.BAD_REQUEST, 'No se permiten imagenes mayores a 2mb');
    else if (error.code === 'LIMIT_UNEXPECTED_FILE')
      error = new ApiError(StatusCodes.BAD_REQUEST, 'Campo inválido');
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || StatusCodes[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message, name } = err;

  if (config.nodeEnv === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    name,
    ...(message.trim().length > 0 && { message }),
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  };

  config.nodeEnv === 'development' && logger.error(err);

  res.status(statusCode).json(response);
};
