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
exports.forgotPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// import { sqlConfig1 } from "../config/sqlConfig";
const dbhelper_1 = __importDefault(require("../dbhelper/dbhelper"));
const dbHelpers = new dbhelper_1.default();
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { email } = req.body;
        // Check if the email exists in the database
        const user = yield dbHelpers.getUserByEmail(email);
        // if (!user) {
        //     return res.status(404).json({ error: "User not found" });
        // }
        // Generate a password reset token
        const token = jsonwebtoken_1.default.sign({ email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h' });
        // Save the token to the database or a temporary storage (e.g., Redis) for validation
        // Send the password reset link or code to the user's email
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        // Use nodemailer to send the email
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: (_a = process.env) === null || _a === void 0 ? void 0 : _a['EMAIL_USERNAME'],
                pass: (_b = process.env) === null || _b === void 0 ? void 0 : _b['EMAIL_PASSWORD'],
            },
        });
        const mailOptions = {
            from: (_c = process.env) === null || _c === void 0 ? void 0 : _c['EMAIL_USERNAME'],
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset link has been sent to your email" });
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ error: "Failed to send password reset email" });
    }
});
exports.forgotPassword = forgotPassword;
