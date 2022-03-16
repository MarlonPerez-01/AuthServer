import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { ApiError } from '../helpers/ApiError';
import { IAccessToken } from '../interfaces/IToken';

export type rol = 'normal' | 'premium';

export const Autorizar = (roles: rol[]) => (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization || '';

  let token = authorization.startsWith('Bearer') ? authorization.split(' ')[1] : '';

  // decodificar token
  const tokenDecoded = jwt.verify(token, config.jwt.accessSecret) as IAccessToken;

  // verificar que tenga un rol valido
  const rol = roles.find((rol) => rol === tokenDecoded.rol);
  if (!rol) throw new ApiError(StatusCodes.FORBIDDEN, 'Rol inválido');

  req.user = tokenDecoded;

  next();
};
