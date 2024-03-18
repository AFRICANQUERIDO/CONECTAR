"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.clientSchema = joi_1.default.object({
    Name: joi_1.default.string().max(250).required(),
    email: joi_1.default.string().email().max(250).required(),
    password: joi_1.default.string().max(250).required(),
});
