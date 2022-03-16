import Joi, { Schema } from 'joi';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/ApiError';

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequestSchema = RequireAtLeastOne<{
  params: Joi.ObjectSchema;
  query: Joi.ObjectSchema;
  body: Joi.ObjectSchema;
}>;

export const validate = (schema: RequestSchema) => (req: Request, res: Response, next: NextFunction) => {
  const pick = (object: any, keys: any) => {
    return keys.reduce((obj: any, key: any) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    }, {});
  };

  const validSchema = pick(schema, ['params', 'query', 'body']);

  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
  }

  Object.assign(req, value);
  next();
};
