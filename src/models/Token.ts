import { OkPacket, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/mysql';
import { IToken } from '../interfaces/IToken';

export const Insertar = async (token: IToken): Promise<OkPacket> => {
  const query = `INSERT INTO Token SET ?;`;
  const [data] = await promisePool.query(query, [token]);
  return <OkPacket>data;
};

export const ObtenerByToken = async (token: string) => {
  const query = `SELECT * FROM Token WHERE token = ?;`;
  const [data] = await promisePool.query(query, [token]);
  return (<RowDataPacket>data)[0] as IToken;
};

export const EliminarByUsuario = async (id: number) => {
  const query = `DELETE FROM Token WHERE id_usuario = ?;`;
  const [data] = await promisePool.query(query, [id]);
  return <OkPacket>data;
};

export const EliminarByToken = async (token: string) => {
  const query = `DELETE FROM Token WHERE token = ?;`;
  const [data] = await promisePool.query(query, [token]);
  return <OkPacket>data;
};
