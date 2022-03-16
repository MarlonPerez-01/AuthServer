import { OkPacket, RowDataPacket } from 'mysql2';
import { promisePool } from '../config/mysql';
import { ICodigo, tipoCodigo } from '../interfaces/ICodigo';

export const Insertar = async (codigo: ICodigo): Promise<OkPacket> => {
  const query = `INSERT INTO Codigo SET ?;`;
  const [data] = await promisePool.query(query, [codigo]);
  return <OkPacket>data;
};

export const Actualizar = async (id: number, codigo: ICodigo) => {
  const query = `UPDATE Codigo SET ? WHERE id_token = ?;`;
  const [data] = await promisePool.query(query, [codigo, id]);

  return <OkPacket>data;
};

export const ObtenerByUsuario = async (id: number) => {
  const query = `SELECT * FROM Codigo WHERE id_usuario = ?;`;
  const [data] = await promisePool.query(query, [id]);
  return (<RowDataPacket>data)[0] as Required<ICodigo>;
};

export const ObtenerByToken = async (codigo: string, tipo: tipoCodigo) => {
  const query = `SELECT * FROM Codigo WHERE codigo = ? AND tipo = ?;`;
  const [data] = await promisePool.query(query, [codigo, tipo]);
  return (<RowDataPacket>data)[0] as ICodigo;
};

export const EliminarById = async (id: number, tipo: tipoCodigo) => {
  const query = `DELETE FROM Codigo WHERE id_token = ? AND tipo = ?;`;
  const [data] = await promisePool.query(query, [id, tipo]);
  return <OkPacket>data;
};

export const EliminarByUsuario = async (id: number, tipo: tipoCodigo) => {
  const query = `DELETE FROM Codigo WHERE id_usuario = ? AND tipo = ?;`;
  const [data] = await promisePool.query(query, [id, tipo]);
  return <OkPacket>data;
};

export const EliminarByToken = async (codigo: string) => {
  const query = `DELETE FROM Codigo WHERE codigo = ?;`;
  const [data] = await promisePool.query(query, [codigo]);
  return <OkPacket>data;
};
