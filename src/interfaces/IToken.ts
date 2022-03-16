import { rol } from '../middlewares/autorizar';

export interface IToken {
  id_token?: number;
  id_usuario: number;
  token: string;
}

export interface IRefreshToken {
  id_usuario: number;
  iat: number;
  exp: number;
}

export interface IAccessToken extends IRefreshToken {
  nombre: string;
  correo: string;
  rol: rol;
}
