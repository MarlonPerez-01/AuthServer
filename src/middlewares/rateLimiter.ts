import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../helpers/ApiError';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Response status code less than 400 are considered successful
  handler: (request, response, next, options) =>
    next(new ApiError(StatusCodes.TOO_MANY_REQUESTS, 'Vuelve a intentarlo más tarde')),
});
