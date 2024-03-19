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
        const users = (yield pool.request().query('SELECT * FROM UserDetails WHERE welcomed = 0')).recordset;
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
            const pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
            yield pool.request()
                .execute('UpdateUserAsWelcomed');
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
// // Function to send OTP emails to users
// export const sendOTPEmails = async () => {
//     let pool;
//     try {
//         pool = await mssql.connect(sqlConfig1);
//         const emails = (await pool.request().query('SELECT email FROM Users')).recordset;
//         for (const { email } of emails) {
//             const OTP = generateOTP();
//             console.log(OTP);
//             const hashedOTP = await bcrypt.hash(OTP, 1);
//             console.log(hashedOTP);
//             const emailTemplateData = { OTP: OTP }; // Pass otp variable to the template data
//             const emailContent = await renderEmailTemplate('Template/OTP.ejs', emailTemplateData);
//             const mailOptions = {
//                 from: "wangaripauline303@gmail.com",
//                 to: email,
//                 subject: "OTP Verification",
//                 html: emailContent // Use emailContent generated from the template
//             };
//             await sendMail(mailOptions);
//             await saveOTPRecord(email, hashedOTP);
//             console.log(`OTP email sent to ${email}`);
//         }
//     } catch (error) {
//         console.error('Error sending OTP emails:', error);
//     } finally {
//         if (pool) await pool.close();
//     }
// };
const sendOTPEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    let pool;
    try {
        pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        const users = (yield pool.request().query('SELECT userID, email FROM UserDetails')).recordset; // Select userID along with email
        for (const { userID, email } of users) { // Iterate over users and extract userID and email
            const OTP = (0, exports.generateOTP)();
            console.log(OTP);
            const hashedOTP = yield bcrypt_1.default.hash(OTP, 1);
            console.log(hashedOTP);
            const emailTemplateData = { OTP: OTP }; // Pass otp variable to the template data
            const emailContent = yield renderEmailTemplate('Template/OTP.ejs', emailTemplateData);
            const mailOptions = {
                from: "wangaripauline303@gmail.com",
                to: email,
                subject: "OTP Verification",
                html: emailContent // Use emailContent generated from the template
            };
            yield (0, emailHelpers_1.sendMail)(mailOptions);
            yield saveOTPRecord(userID, hashedOTP); // Pass userID along with hashedOTP
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
// Function to save hashed OTP in the Users table
const saveOTPRecord = (userID, hashedOTP) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        // Save the hashed OTP in the Users table
        yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .input('hashedOTP', mssql_1.default.VarChar, hashedOTP)
            .query('UPDATE UserDetails SET OTP = @hashedOTP WHERE userID = @userID');
        yield pool.close();
        console.log('Saved hashed OTP for user:', userID);
    }
    catch (error) {
        console.error('Error saving hashed OTP:', error);
        throw error;
    }
});
