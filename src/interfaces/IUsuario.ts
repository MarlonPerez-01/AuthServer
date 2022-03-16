import { rol } from '../middlewares/autorizar';

export interface IUsuarioPost {
  nombre: string;
  correo: string;
  contrasenia: string;
  rol?: rol;
  google?: number | null;
  foto: string | null;
}

export interface IUsuario extends IUsuarioPost {
  id_usuario: number;
  verificado: boolean;
  estado: boolean;
}

export interface IUsuarioUpdate extends Partial<IUsuario> {}
