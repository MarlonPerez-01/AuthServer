import Joi from 'joi';

export const signup = {
  body: Joi.object().keys({
    nombre: Joi.string().required(),
    correo: Joi.string().email().required(),
    contrasenia: Joi.string().required(),
  }),
};

export const signin = {
  body: Joi.object().keys({
    correo: Joi.string().email().required(),
    contrasenia: Joi.string().required(),
  }),
};

export const signinGoogle = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

export const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const resendVerificationEmail = {
  body: Joi.object().keys({
    correo: Joi.string().email().required(),
  }),
};

export const verifyEmail = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const changePassword = {
  body: Joi.object().keys({
    contrasenia: Joi.string().required(),
    nueva: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    correo: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  body: Joi.object().keys({
    resetToken: Joi.string().required(),
    nuevaContrasenia: Joi.string().required(),
  }),
};
