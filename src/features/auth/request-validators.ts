import { celebrate, Segments, Joi } from 'celebrate';

export const loginValidator = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  { abortEarly: false }
);

export const registerValidator = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  },
  { abortEarly: false }
);

export const updateUserInfoValidator = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  },
  { abortEarly: false }
);

export const changePasswordValidator = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      passwordOld: Joi.string().required(),
      passwordNew: Joi.string().required(),
    }),
  },
  { abortEarly: false }
);

export const requestResetPasswordValidator = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  },
  { abortEarly: false }
);
