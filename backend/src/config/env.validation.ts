import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const validationSchema = Joi.object({
  FRONTEND_URL: Joi.string().default('http://localhost:3000/'),
  APP_NAME: Joi.string().default('atributo'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_LEVEL: Joi.string().default('debug'),
  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_KEY: Joi.string().required(),
  JWT_EXPIRED: Joi.string().default('1d'),

  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().default(587),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().allow('').optional(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
});

export const appConfig = registerAs('app', () => ({
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000/',
  appName: process.env.APP_NAME ?? 'atributo-backend',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'debug',
  port: Number(process.env.PORT) || 3000,
}));

export const dbConfig = registerAs('db', () => ({
  url: process.env.DATABASE_URL ?? '',
}));

export const jwtConfig = registerAs('jwt', () => ({
  key: process.env.JWT_KEY ?? '',
  expired: process.env.JWT_EXPIRED ?? '1d',
}));

export const cloudinaryConfig = registerAs('cloudinary', () => ({
  name: process.env.CLOUDINARY_NAME ?? '',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '',
}));

export const mailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST ?? '',
  port: Number(process.env.MAIL_PORT) || 587,
  user: process.env.MAIL_USER ?? '',
  password: process.env.MAIL_PASSWORD ?? '',
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD ?? '',
}));
