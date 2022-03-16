import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: './.env' });

const envSchema = Joi.object()
  .keys({
    CLIENT_URL: Joi.string().required(),
    CODE_EXPIRATION_MINUTES: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_USER: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_SECRET_ID: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRATION_MINUTES: Joi.number().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
    SMT_FROM: Joi.string().email().required(),
    SMT_HOST: Joi.string().required(),
    SMT_PASS: Joi.string().required(),
    SMT_USER: Joi.string().email().required(),
  })
  .unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) throw new Error(`Config error: ${error.message}`);

export const config = {
  clientURL: envVars.CLIENT_URL,
  codeExpirationMinutes: envVars.CODE_EXPIRATION_MINUTES,
  DB: {
    host: envVars.DB_HOST,
    name: envVars.DB_NAME,
    password: envVars.DB_PASSWORD,
    user: envVars.DB_USER,
  },
  google: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    secretID: envVars.GOOGLE_SECRET_ID,
  },
  jwt: {
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpirationMinutes: envVars.JWT_REFRESH_EXPIRATION_MINUTES,
  },
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  SMT: {
    from: envVars.SMT_HOST,
    host: envVars.SMT_HOST,
    pass: envVars.SMT_PASS,
    user: envVars.SMT_USER,
  },
};
