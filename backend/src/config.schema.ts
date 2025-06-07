import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required().messages({
    'string.empty': 'DATABASE_URL must be defined in .env file',
    'any.required': 'DATABASE_URL is a required environment variable',
  }),
  JWT_SECRET_KEY: Joi.string().required().messages({
    'string.empty': 'JWT_SECRET_KEY must be defined in .env file',
    'any.required': 'JWT_SECRET_KEY is a required environment variable',
  }),
  JWT_EXPIRATION_TIME: Joi.string().default('30m'),
});
