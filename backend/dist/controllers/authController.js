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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.checkUserDetails = exports.validateUser = exports.loginUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mssql_1 = __importDefault(require("mssql"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbhelper_1 = __importDefault(require("../dbHelper/dbhelper"));
const sqlConfig_1 = require("../config/sqlConfig");
// import dotenv from 'dotenv'
const dbHelpers = new dbhelper_1.default;
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const user = (yield pool.request().input('email', mssql_1.default.VarChar, email)
            .input('password', mssql_1.default.VarChar, password).execute('loginUser'))
            .recordset;
        console.log(user);
        if (((_a = user[0]) === null || _a === void 0 ? void 0 : _a.email) == email) {
            const correctPWD = yield bcrypt_1.default.compare(password, (_b = user[0]) === null || _b === void 0 ? void 0 : _b.password);
            if (user.length < 1) {
                return res.json({
                    error: "User not found"
                });
            }
            const isVerified = user[0].isVerified;
            if (!isVerified) {
                return res.json({
                    error: "You need to verify your email to login. Check your inbox"
                });
            }
            if (!correctPWD) {
                return res.json({
                    error: "Incorrect Password"
                });
            }
            const loginCredentials = user.map((records) => {
                const { password } = records, rest = __rest(records, ["password"]);
                return rest;
            });
            const token = jsonwebtoken_1.default.sign(loginCredentials[0], process.env.SECRET, {
                expiresIn: '36000h'
            });
            return res.json(Object.assign({ message: 'User Logged in successfully', token }, loginCredentials[0]));
        }
        else {
            return res.json({
                error: "Email not found"
            });
        }
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.loginUserController = loginUserController;
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userID = req.params.id;
        const { OTP } = req.body;
        // Check if the request body is empty
        if (!OTP) {
            return res.json({ error: "Request body is missing or empty" });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Retrieve the user's OTP from the database
        const result = (yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .query('SELECT * FROM UserDetails WHERE userID = @userID')).recordset;
        console.log('users: ', result);
        const userOTP = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.OTP;
        console.log(userOTP);
        if (!userOTP) {
            return res.json({ error: "Invalid OTP" });
        }
        let VerifiedStatus = (_d = result[0]) === null || _d === void 0 ? void 0 : _d.isVerified;
        if (VerifiedStatus == 1 && OTP === null) {
            return res.json({
                error: "Email is already verified"
            });
        }
        // Compare the received OTP with the user's OTP
        const isMatch = yield bcrypt_1.default.compare(OTP, userOTP);
        console.log(isMatch);
        if (isMatch) {
            // Update the user's verification status
            const updateResult = yield pool.request()
                .input('userID', mssql_1.default.VarChar, userID)
                .query('UPDATE UserDetails SET isVerified = 1 WHERE userID = @userID AND isVerified = 0');
            const rowsAffected = updateResult.rowsAffected[0];
            if (rowsAffected > 0) {
                // Delete the OTP from the database
                yield pool.request()
                    .input('userID', mssql_1.default.VarChar, userID)
                    .query('UPDATE UserDetails SET OTP = NULL WHERE userID = @userID');
                return res.json({
                    success: "Email successfully validated and OTP deleted"
                });
            }
            else {
                return res.json({
                    error: "Email is already verified"
                });
            }
        }
        else {
            return res.json({
                error: "Invalid OTP"
            });
        }
    }
    catch (error) {
        return res.json({ error: "Internal server error" });
    }
});
exports.validateUser = validateUser;
const checkUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        return res.json({
            info: req.info
        });
    }
});
exports.checkUserDetails = checkUserDetails;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const checkEmail = `
            SELECT 
                CASE
                    WHEN EXISTS (SELECT 1 FROM Specialist WHERE email = @email) THEN 1
                    WHEN EXISTS (SELECT 1 FROM Clients WHERE email = @email) THEN 1
                    ELSE 0
                END AS userExists
        `;
        const emailCheckResult = yield pool.request()
            .input("email", email)
            .query(checkEmail);
        const notExists = emailCheckResult.recordset[0].userExists;
        if (notExists === 0) {
            return res.json({
                message: "User not found"
            });
        }
        let hashedPwd = yield bcrypt_1.default.hash(password, 5);
        const updatequery = `EXEC resetPassword @email, @password`;
        const updateResult = yield pool.request()
            .input("email", email)
            .input("password", hashedPwd)
            .query(updatequery);
        if (updateResult.rowsAffected[0] < 1) {
            return res.json({
                message: "Failed to update password"
            });
        }
        else {
            return res.json({
                message: "Password updated successfully"
            });
        }
    }
    catch (error) {
        return res.status(501).json({
            error: 'error catch block'
        });
    }
});
exports.resetPassword = resetPassword;
