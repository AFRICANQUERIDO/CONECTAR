import joi from 'joi';

export const jobSchema = joi.object({
    jobName: joi.string().max(250).required(),
    industry: joi.string().max(250).required(),
    description:joi.string().max(250).required(),
    duration: joi.string().max(250).required(),
    budget: joi.string().max(250).required(),
    customer_id: joi.string().max(250).required(),
    specialist_id: joi.string().max(250).required(),
});