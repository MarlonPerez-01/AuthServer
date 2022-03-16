import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import { tipoCodigo } from '../interfaces/ICodigo';

export const CrearCodigo = (idUsuario: number, tipo: tipoCodigo, minutos: number = 15) => ({
  id_usuario: idUsuario,
  codigo: crypto.randomInt(100000, 1000000).toString(),
  tipo,
  fecha_creacion: new Date(),
  fecha_expiracion: addMinutes(new Date(), minutos),
});
