import { NextFunction, Request, Response } from 'express';
import { unlinkSync } from 'fs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import path from 'path';
import { ApiError } from '../helpers/ApiError';
import { catchAsync } from '../helpers/catchAsync';
import { IUsuarioUpdate } from '../interfaces/IUsuario';
import * as Usuario from '../models/Usuario';

export const ObtenerById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (Number(id) !== req.user.id_usuario) throw new ApiError(StatusCodes.FORBIDDEN);

  const { contrasenia, verificado, estado, ...usuarioDB } = await Usuario.ObtenerById(Number(id));

  res.json({ msg: ReasonPhrases.OK, data: usuarioDB });
});

export const Actualizar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const usuario = req.body as IUsuarioUpdate;

  if (Number(id) !== req.user.id_usuario) throw new ApiError(StatusCodes.FORBIDDEN);

  const usuarioDB = await Usuario.ObtenerById(Number(id));

  if (req.file?.filename) {
    unlinkSync(path.join(__dirname, `../../public/uploads/${usuarioDB.foto}`));
    usuario.foto = req.file?.filename;
  }

  await Usuario.Actualizar(Number(id), usuario);

  res.json({ msg: ReasonPhrases.OK });
});
