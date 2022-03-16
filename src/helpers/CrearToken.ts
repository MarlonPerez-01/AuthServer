import { IUsuario } from '../interfaces/IUsuario';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { tipoToken } from '../types/rol';

export const generarToken = (tipo: tipoToken, usuario: Required<IUsuario>) =>
  tipo === 'access' ? generarAccessToken(usuario) : generarRefreshToken(usuario);

const generarAccessToken = (usuario: Required<IUsuario>): string =>
  jwt.sign(
    { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    config.jwt.accessSecret,
    {
      expiresIn: config.jwt.accessExpirationMinutes + 'm',
    }
  );

const generarRefreshToken = (usuario: Required<IUsuario>): string =>
  jwt.sign({ id_usuario: usuario.id_usuario }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpirationMinutes + 'm',
  });
