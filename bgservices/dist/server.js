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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const welcomeUser_1 = require("./Mailservices/welcomeUser"); // Assuming sendOTP function is exported from the same file
const app = (0, express_1.default)();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Schedule the task to run every 50 seconds to check for new users and send welcome emails
        node_cron_1.default.schedule('*/50 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Checking for new users...');
            yield (0, welcomeUser_1.sendWelcomeEmails)();
        }));
        // Schedule the task to run every minute to generate OTPs and send them via email
        node_cron_1.default.schedule('*/5000 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Running OTP generation and email sending');
            yield (0, welcomeUser_1.sendOTPEmails)();
        }));
        console.log('Cron jobs scheduled successfully.');
    }
    catch (error) {
        console.error('Error scheduling cron jobs:', error);
    }
});
run();
app.listen(4200, () => {
    console.log("Server running on port 4200...");
});
