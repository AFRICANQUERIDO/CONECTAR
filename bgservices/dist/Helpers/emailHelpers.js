"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createTransporter(config) {
    return nodemailer_1.default.createTransport(config);
}
const configurations = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: (_a = process.env) === null || _a === void 0 ? void 0 : _a['EMAIL_USERNAME'],
        pass: (_b = process.env) === null || _b === void 0 ? void 0 : _b['EMAIL_PASSWORD']
    }
};
const sendMail = (messageOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = createTransporter(configurations);
        yield transporter.verify();
        const info = yield transporter.sendMail(messageOptions);
        console.log('Message sent: %s', info.messageId);
    }
    catch (error) {
        console.error('Error sending mail:', error);
        throw error;
    }
});
exports.sendMail = sendMail;
