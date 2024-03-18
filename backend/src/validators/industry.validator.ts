import joi from 'joi'

export const newIndustrySchema = joi.object({
    industryName: joi.string().required()
})