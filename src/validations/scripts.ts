import Joi from 'joi';

export const postScriptsQuery = Joi.object()
  .keys({
    originServer: Joi.string().required(),
    originPort: Joi.number().required(),
    originDatabase: Joi.string().required(),
    originUser: Joi.string().required(),
    originPassword: Joi.string().required(),
    originEncrypt: Joi.boolean().required(),
  })
  .required();
