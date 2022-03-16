import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  name: string;
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: StatusCodes, message = '', isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.name = getReasonPhrase(statusCode);
    this.isOperational = isOperational;
    stack ? (this.stack = stack) : Error.captureStackTrace(this, this.constructor);
  }
}
