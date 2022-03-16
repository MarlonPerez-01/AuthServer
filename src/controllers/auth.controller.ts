import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { isAfter, isBefore } from 'date-fns';
import { config } from '../config/config';
import { catchAsync } from '../helpers/catchAsync';
import { IUsuarioPost } from '../interfaces/IUsuario';
import { ICodigo } from '../interfaces/ICodigo';
import { hashPass, comparePass } from '../helpers/contrasenia';
import { CrearCodigo } from '../helpers/CrearCodigo';
import { generarToken } from '../helpers/CrearToken';
import { enviarCorreo } from '../helpers/enviarCorreo';
import { googleVerify } from '../helpers/google';
import { ApiError } from '../helpers/ApiError';
import * as Usuario from '../models/Usuario';
import * as Codigo from '../models/Codigo';
import * as Token from '../models/Token';

export const Signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const usuario = req.body as IUsuarioPost;

  let usuarioDB = await Usuario.ObtenerByCorreo(usuario.correo);

  // verificar que no exista el usuario
  if (usuarioDB) {
    throw usuarioDB.verificado == false
      ? new ApiError(400, 'Revisa tu correo para verificar tu cuenta')
      : new ApiError(409, `Ya existe un usuario con el correo ${usuario.correo}`);
  }

  // hashear contrasenia
  usuario.contrasenia = bcrypt.hashSync(usuario.contrasenia, 10);

  // almacenar usuario en la db
  await Usuario.Insertar({ ...usuario, rol: 'normal', google: null });

  // obtener usuario de la db
  usuarioDB = await Usuario.ObtenerByCorreo(usuario.correo);

  // generar token
  // const token: IToken = crearToken('email', usuarioDB);
  const codigo: ICodigo = CrearCodigo(usuarioDB.id_usuario, 'email');

  // almacenar token en la db
  await Codigo.Insertar(codigo);

  // enviar correo con el token
  await enviarCorreo({
    to: usuario.correo,
    subject: 'Verificar cuenta',
    text: `Tu codigo de confirmación es: ${codigo.codigo}`,
  });

  res.json({ msg: `Se ha enviado un código de verificación al correo: ${usuario.correo}` });
});

export const Signin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const usuario: Pick<IUsuarioPost, 'correo' | 'contrasenia'> = req.body;

  // verificar que exista el usuario
  const usuarioDB = await Usuario.ObtenerByCorreo(usuario.correo);

  if (!usuarioDB)
    throw new ApiError(StatusCodes.CONFLICT, `No existe usuario con el correo ${usuario.correo}`);

  // validar que sea un usuario verificado
  if (!usuarioDB.verificado)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Verifica tu cuenta antes para poder iniciar sesión');

  // validar contrasenia
  const match = comparePass(usuario.contrasenia, usuarioDB.contrasenia);
  if (!match) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas');

  // generar tokens
  const refreshToken = generarToken('refresh', usuarioDB);
  const accessToken = generarToken('access', usuarioDB);

  // almacenar el refresh token en la db
  await Token.Insertar({ id_usuario: usuarioDB.id_usuario, token: refreshToken });

  res.json({ msg: ReasonPhrases.OK, data: { refreshToken, accessToken } });
});

export const SigninGoogle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id_token: idToken } = req.body;

  const { idGoogle, nombre, correo, foto } = await googleVerify(idToken);

  const usuarioDB = await Usuario.ObtenerByGoogle(idGoogle);

  // si existe usuario en la db con cuenta de google solo se generan los tokens
  if (usuarioDB) {
    // generar tokens
    const refreshToken = generarToken('refresh', usuarioDB);
    const accessToken = generarToken('access', usuarioDB);

    return res.json({ msg: 'Iniciando sesión con google', data: { accessToken, refreshToken } });
  } else {
    // si existe usuario en la db con cuenta local se vincula

    const usuarioDB = await Usuario.ObtenerByCorreo(correo || '');

    if (usuarioDB) {
      const { id_usuario } = usuarioDB;

      await Usuario.VincularGoogle(id_usuario, idGoogle);

      // generar tokens
      const refreshToken = generarToken('refresh', usuarioDB);
      const accessToken = generarToken('access', usuarioDB);

      return res.json({ msg: 'Vinculando cuenta local con google', data: { accessToken, refreshToken } });
    } else {
      // si no existe usuario en la db ni con cuenta de google ni con cuenta local se crea el usuario
      const { insertId } = await Usuario.Insertar({
        nombre: nombre || '',
        correo: correo || '',
        contrasenia: '',
        foto: foto || null,
        rol: 'normal',
        google: idGoogle,
      });

      const usuarioDB = await Usuario.ObtenerById(insertId);

      // generar tokens
      const refreshToken = generarToken('refresh', usuarioDB);
      const accessToken = generarToken('access', usuarioDB);

      return res.json({ msg: 'Registrandose con google', data: { accessToken, refreshToken } });
    }
  }
});

export const RefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let { refreshToken: token } = req.body;

  const tokenDB = await Token.ObtenerByToken(token);

  if (!tokenDB) throw new ApiError(StatusCodes.UNAUTHORIZED);

  const usuarioDB = await Usuario.ObtenerById(tokenDB.id_usuario);

  jwt.verify(token, config.jwt.refreshSecret);

  const accesstoken = generarToken('access', usuarioDB);

  res.json({ msg: ReasonPhrases.OK, data: { accesstoken } });
});

export const Logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  const { affectedRows } = await Token.EliminarByToken(refreshToken);

  if (!affectedRows) throw new ApiError(StatusCodes.BAD_REQUEST, 'Token inválido');

  res.json({ msg: ReasonPhrases.OK });
});

export const ResendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { correo } = req.body;

  const usuarioDB = await Usuario.ObtenerByCorreo(correo);

  if (!usuarioDB) throw new ApiError(StatusCodes.BAD_REQUEST, `No existe usuario con el correo ${correo}`);

  // validar que el correo aun no haya sido verificado
  if (usuarioDB.verificado)
    throw new ApiError(StatusCodes.BAD_REQUEST, `El correo: ${correo} ya ha sido verificado`);

  const tokenDB = await Codigo.ObtenerByUsuario(usuarioDB.id_usuario);

  // verificar que no exista ya un token valido
  const valido = isBefore(new Date(), new Date(tokenDB.fecha_expiracion));

  if (valido) throw new ApiError(StatusCodes.TOO_MANY_REQUESTS, `Vuelve a intentarlo más tarde`);

  // crear token
  // const token = crearToken('email', usuarioDB);
  const token = CrearCodigo(usuarioDB.id_usuario, 'email');

  // actualizar token
  Codigo.Actualizar(tokenDB.id_codigo, token);

  // enviar correo con el token
  await enviarCorreo({
    to: correo,
    subject: 'Verificar cuenta',
    text: `Tu codigo de confirmación es: ${token}`,
  });

  res.json({ msg: `Se ha enviado un código de verificación al correo: ${correo}` });
});

export const VerifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  const codigoDB = await Codigo.ObtenerByToken(token, 'email');

  if (!codigoDB) throw new ApiError(StatusCodes.BAD_REQUEST, 'Token inválido');

  // validar que no haya expirado
  const fechaExpiracion = new Date(codigoDB.fecha_expiracion);
  const caducado = isBefore(fechaExpiracion, new Date());

  if (caducado) throw new ApiError(StatusCodes.BAD_REQUEST, 'El código ha expirado');

  await Codigo.EliminarByToken(token);
  await Usuario.Verificar(codigoDB.id_usuario);

  res.json({ msg: 'Tu correo ha sido verificado' });
});

export const ChangePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { contrasenia, nueva } = req.body;

  const usuarioDB = await Usuario.ObtenerById(req.user.id_usuario);

  const match = comparePass(contrasenia, usuarioDB.contrasenia);

  if (!match) throw new ApiError(StatusCodes.BAD_REQUEST, 'Contraseña inválida');

  const hash = hashPass(nueva);

  await Usuario.CambiarContrasenia(usuarioDB.id_usuario, hash);

  res.json({ msg: ReasonPhrases.OK });
});

export const ForgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { correo } = req.body;

  // verificar que exista el usuario
  const usuarioDB = await Usuario.ObtenerByCorreo(correo);

  if (!usuarioDB) throw new ApiError(StatusCodes.CONFLICT, `No existe usuario con el correo ${correo}`);

  // validar que sea un usuario verificado
  if (!usuarioDB.verificado)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Verifica tu cuenta antes para poder cambiar tu contraseña');

  const tokenDB = await Codigo.ObtenerByUsuario(usuarioDB.id_usuario);

  // verificar que no exista ya un token valido
  if (tokenDB) {
    const valido = isBefore(new Date(), new Date(tokenDB.fecha_expiracion));
    if (valido) throw new ApiError(StatusCodes.TOO_MANY_REQUESTS, `Vuelve a intentarlo más tarde`);
  }

  // eliminar codigo en db
  await Codigo.EliminarByUsuario(usuarioDB.id_usuario, 'password');

  // crear codigo
  const token = CrearCodigo(usuarioDB.id_usuario, 'password');

  // insertar codigo en db
  await Codigo.Insertar(token);

  // enviar correo con el token
  await enviarCorreo({
    to: correo,
    subject: 'Verificar cuenta',
    text: `Tu codigo para reestablecer tu contraseña es: ${token}`,
  });

  res.json({ msg: `Se ha enviado un código de verificación al correo: ${correo}` });
});

export const ResetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { resetToken, nuevaContrasenia } = req.body;

  const codigoDB = await Codigo.ObtenerByToken(resetToken, 'password');

  if (!codigoDB) throw new ApiError(StatusCodes.BAD_REQUEST, 'Código inválido');

  // validar que no haya expirado
  const fechaExpiracion = new Date(codigoDB.fecha_expiracion);
  const caducado = isBefore(fechaExpiracion, new Date());

  if (caducado) throw new ApiError(StatusCodes.BAD_REQUEST, 'El código ha expirado');

  // cerrar sesion y eliminar el codigo utilizado
  await Token.EliminarByUsuario(codigoDB.id_usuario);
  await Codigo.EliminarByUsuario(codigoDB.id_usuario, 'password');

  const hash = hashPass(nuevaContrasenia);

  await Usuario.CambiarContrasenia(codigoDB.id_usuario, hash);

  res.json({ msg: ReasonPhrases.OK });
});
