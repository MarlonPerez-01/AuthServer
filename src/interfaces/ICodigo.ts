export type tipoCodigo = 'email' | 'password';

export interface ICodigo {
  id_codigo?: number;
  id_usuario: number;
  codigo: string;
  tipo: tipoCodigo;
  fecha_creacion: Date;
  fecha_expiracion: Date;
}
