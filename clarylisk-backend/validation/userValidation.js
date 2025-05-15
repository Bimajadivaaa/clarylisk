import Joi from 'joi';

export const regisValidation= Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().required().max(8),
    description:Joi.string().required(),
    role:Joi.string().required(),
    walletAddress:Joi.string().required(),
    image:Joi.string().required(),
    facebook:Joi.string().allow(null,''),
    instagram:Joi.string().allow(null,''),
    twitter:Joi.string().allow(null,''),
    youtube:Joi.string().allow(null,'')
})

export const loginValidation= Joi.object({
    walletAddress:Joi.string().required(),
    password: Joi.string().required().max(8)
})