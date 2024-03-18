import joi from 'joi'

export const clientSchema = joi.object({
    Name: joi.string().max(250).required(),
    email: joi.string().email().max(250).required(),
    password: joi.string().max(250).required(),
});

