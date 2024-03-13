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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sqlConfig_1 = require("../config/sqlConfig");
const mssql_1 = __importDefault(require("mssql"));
const pool = await mssql_1.default.connect(sqlConfig_1.sqlConfig);
const users = (await pool.request().query('SELECT * FROM Users WHERE welcomed = 0')).recordset;
// Create a Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: "wangaripauline303@gmail.com",
        pass: 'your_password'
    }
});
// test transporter
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Ready for messages");
        console.log(success);
    }
});
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sendMail(mailOptions);
        yield pool.request().query(`UPDATE Users SET welcomed = 1 WHERE userID = ${user.userID}`);
        console.log(`Email sent to ${user.Name}`);
    }
    catch (error) {
        console.log(error);
    }
});
// Configure email options
const mailOptions = {
    from: 'wangaripauline303@gmail.com', // sender email address
    to: user.email,
    subject: "Here is your OTP",
    text: `Your OTP is: ${otp}`
};
try { }
catch (error) {
    error: "Error when generating OTP";
}
sendEmail();
