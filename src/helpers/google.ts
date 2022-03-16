import { OAuth2Client } from 'google-auth-library';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config/config';
import { ApiError } from './ApiError';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async (idToken: string) => {
  const ticket = await client.verifyIdToken({ idToken, audience: config.google.clientID });

  const payload = ticket.getPayload();

  if (!payload) throw new ApiError(StatusCodes.BAD_REQUEST, 'Intente nuevamente con otra cuenta');

  return {
    idGoogle: Number(payload.sub),
    nombre: payload.name,
    correo: payload.email,
    foto: payload.picture,
  };
};
