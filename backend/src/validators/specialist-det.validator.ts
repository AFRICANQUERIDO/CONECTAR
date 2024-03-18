
import joi from 'joi'

export const profileSchema = joi.object({
    photo: joi.string().max(250).required(),
    role: joi.string().max(250).required(),
    experience: joi.string().max(250).required(),
    education: joi.string().max(250).required(),
    languages: joi.string().max(250).required(),
    skills: joi.string().max(250).required(),
    description: joi.string().max(250).required(),
    location: joi.string().max(250).required(),
    // hourlyRate: joi.string().max(250).required()
});

