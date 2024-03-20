"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.orderSchema = joi_1.default.object({
    userID: joi_1.default.string().required(),
    gigID: joi_1.default.string().required(),
    orderDescription: joi_1.default.string().required(),
    startDate: joi_1.default.string().required(),
    endDate: joi_1.default.string().required(),
    quantity: joi_1.default.number().integer().required(),
    totalAmount: joi_1.default.number().integer().required(),
    status: joi_1.default.string().required(),
    // source: Joi.string().required()
});
