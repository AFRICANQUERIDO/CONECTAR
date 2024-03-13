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
exports.generateOTP = exports.sendOTPEmails = exports.sendWelcomeEmails = void 0;
const mssql_1 = __importDefault(require("mssql"));
const ejs_1 = __importDefault(require("ejs"));
const emailHelpers_1 = require("../Helpers/emailHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sqlconfig_1 = require("../config/sqlconfig");
// Function to send a welcome email to users who haven't been welcomed yet
const sendWelcomeEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    let pool;
    try {
        pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        const users = (yield pool.request().query('SELECT * FROM Users WHERE welcomed = 0')).recordset;
        for (const user of users) {
            const emailTemplateData = { Name: user.Name };
            const emailContent = yield renderEmailTemplate('Template/welcomeUser.ejs', emailTemplateData);
            const mailOptions = {
                from: "wangaripauline303@gmail.com",
                to: user.email,
                subject: "Welcome to Conectar",
                html: emailContent
            };
            yield (0, emailHelpers_1.sendMail)(mailOptions);
            yield updateUserAsWelcomed();
            console.log(`Welcome email sent to ${user.Name}`);
        }
    }
    catch (error) {
        console.error('Error sending welcome emails:', error);
    }
    finally {
        if (pool)
            yield pool.close();
    }
});
exports.sendWelcomeEmails = sendWelcomeEmails;
// Function to send OTP emails to users
// Function to send OTP emails to users
const sendOTPEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    let pool;
    try {
        pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        const emails = (yield pool.request().query('SELECT email FROM Users')).recordset;
        for (const { email } of emails) {
            const otp = (0, exports.generateOTP)();
            console.log(otp);
            const hashedOTP = yield bcrypt_1.default.hash(otp, 1);
            console.log(hashedOTP);
            const emailTemplateData = { otp: otp }; // Pass otp variable to the template data
            const emailContent = yield renderEmailTemplate('Template/OTP.ejs', emailTemplateData);
            const mailOptions = {
                from: "wangaripauline303@gmail.com",
                to: email,
                subject: "OTP Verification",
                html: emailContent // Use emailContent generated from the template
            };
            yield (0, emailHelpers_1.sendMail)(mailOptions);
            yield saveOTPRecord(email, hashedOTP);
            console.log(`OTP email sent to ${email}`);
        }
    }
    catch (error) {
        console.error('Error sending OTP emails:', error);
    }
    finally {
        if (pool)
            yield pool.close();
    }
});
exports.sendOTPEmails = sendOTPEmails;
// Function to render an email template
const renderEmailTemplate = (templatePath, templateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield ejs_1.default.renderFile(templatePath, templateData);
    }
    catch (error) {
        console.error('Error rendering email template:', error);
        throw error;
    }
});
// Function to generate a random OTP within a specified range
const generateOTP = () => {
    const min = 1000; // Minimum value for the OTP
    const max = 9999; // Maximum value for the OTP
    return `${Math.floor(min + Math.random() * (max - min + 1))}`;
};
exports.generateOTP = generateOTP;
// Function to update user as welcomed in the database
const updateUserAsWelcomed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        yield pool.request()
            .execute('UpdateUserAsWelcomed');
        yield pool.close();
    }
    catch (error) {
        console.error('Error updating user as welcomed:', error);
        throw error;
    }
});
// Function to save OTP record in the database
const saveOTPRecord = (email, hashedOTP) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logic to save OTP record in the database
    console.log('Saving OTP record for email:', email);
});
