"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.jobSchema = joi_1.default.object({
    jobName: joi_1.default.string().max(250).required(),
    industry: joi_1.default.string().max(250).required(),
    description: joi_1.default.string().max(250).required(),
    duration: joi_1.default.string().max(250).required(),
    budget: joi_1.default.string().max(250).required(),
    customer_id: joi_1.default.string().max(250).required(),
    specialist_id: joi_1.default.string().max(250).required(),
});
