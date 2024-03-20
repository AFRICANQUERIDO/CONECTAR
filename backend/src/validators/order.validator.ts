import Joi from 'joi';

export const orderSchema = Joi.object({
    userID: Joi.string().required(),
    gigID: Joi.string().required(),
    orderDescription: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    totalAmount: Joi.number().integer().required(),
    status: Joi.string().required(),
    // source: Joi.string().required()

});