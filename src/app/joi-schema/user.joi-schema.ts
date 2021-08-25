import Joi = require('@hapi/joi');
import { UserRole } from '../../db/enum';

export const userSignUpSchema = Joi.object({
  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  role: Joi.string().valid(UserRole.REGULAR).required(),

  password: Joi.string().min(3).required(),
});

export const userSignUpAdminSchema = Joi.object({
  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),

  password: Joi.string().min(3).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(3).required(),
});

export const userUpdateJoiSchema = Joi.object({
  name: Joi.string().min(3),

  email: Joi.string().email(),

  role: Joi.string().valid('regular', 'manager', 'admin'),

  password: Joi.string().min(3),
});
