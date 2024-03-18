"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.profileSchema = joi_1.default.object({
    photo: joi_1.default.string().max(250).required(),
    role: joi_1.default.string().max(250).required(),
    experience: joi_1.default.string().max(250).required(),
    education: joi_1.default.string().max(250).required(),
    languages: joi_1.default.string().max(250).required(),
    skills: joi_1.default.string().max(250).required(),
    description: joi_1.default.string().max(250).required(),
    location: joi_1.default.string().max(250).required(),
    // hourlyRate: joi.string().max(250).required()
});
