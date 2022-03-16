import { OkPacket, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/mysql';
import { IUsuario, IUsuarioPost, IUsuarioUpdate } from '../interfaces/IUsuario';

export const ObtenerById = async (id: number) => {
  const query = `SELECT * FROM Usuario WHERE id_usuario = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [id]);

  return (<RowDataPacket>data)[0] as Required<IUsuario>;
};

export const ObtenerByCorreo = async (correo: string) => {
  const query = `SELECT * FROM Usuario WHERE correo = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [correo]);

  return (<RowDataPacket>data)[0] as Required<IUsuario>;
};

export const Insertar = async (usuario: Required<IUsuarioPost>) => {
  const query = `INSERT INTO Usuario SET ?;`;
  const [data] = await promisePool.query(query, [usuario]);

  return <OkPacket>data;
};

export const Actualizar = async (id: number, usuario: IUsuarioUpdate) => {
  const query = `UPDATE Usuario SET ? WHERE id_usuario = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [usuario, id]);

  return <OkPacket>data;
};

export const Verificar = async (id: number) => {
  const query = `UPDATE Usuario SET verificado = 1 WHERE id_usuario = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [id]);

  return <OkPacket>data;
};

export const CambiarContrasenia = async (id: number, contrasenia: string) => {
  const query = `UPDATE Usuario SET contrasenia = ? WHERE id_usuario = ? AND verificado = 1 AND estado = 1;`;
  const [data] = await promisePool.query(query, [contrasenia, id]);

  return <OkPacket>data;
};

export const ObtenerByGoogle = async (google: number): Promise<Required<IUsuario>> => {
  const query = `SELECT * FROM Usuario WHERE google = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [google]);

  return (<RowDataPacket>data)[0] as Required<IUsuario>;
};

export const VincularGoogle = async (id: number, google: number) => {
  const query = `UPDATE Usuario SET google = ? WHERE id_usuario = ? AND estado = 1;`;
  const [data] = await promisePool.query(query, [google, id]);

  return <OkPacket>data;
};
