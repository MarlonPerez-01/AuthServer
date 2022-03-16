import Joi from 'joi';

export const actualizar = {
  body: Joi.object().keys({
    nombre: Joi.string().required(),
    correo: Joi.string().required(),
  }),
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

export const obtener = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};
