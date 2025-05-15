import Joi from 'joi';

export const aiValidation = Joi.object({
    text: Joi.string().required()
})