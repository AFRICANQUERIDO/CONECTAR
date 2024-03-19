"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIndustrySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.newIndustrySchema = joi_1.default.object({
    industryName: joi_1.default.string().required(),
    industryImage: joi_1.default.string().required()
});
