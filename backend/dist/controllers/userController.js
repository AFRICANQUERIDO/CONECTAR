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
exports.resetPasswordController = exports.getUserDetails = exports.updateUserController = exports.deleteUserController = exports.getSingleUserController = exports.fetchAllUSersController = exports.checkUserDetails = exports.validateUser = exports.loginUserController = exports.registerUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbhelper_1 = __importDefault(require("../dbHelper/dbhelper"));
const sqlConfig_1 = require("../config/sqlConfig");
// import dotenv from 'dotenv'
const dbHelpers = new dbhelper_1.default;
// let SECRET = "QRTWVNSASMJWIO"
const registerUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, email, password } = req.body;
        if (!Name || !email || !password) {
            return res.json({ error: "Empty input fields" });
        }
        else if (!/^[a-zA-Z\s]*$/.test(Name)) {
            return res.json({ error: "Invalid name entered" });
        }
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            return res.json({ error: "Invalid email format entered" });
        }
        else if (password.length < 8) {
            return res.json({ error: "Password is too short!" });
        }
        const emailExists = yield checkIfEmailExists(email);
        if (emailExists) {
            return res.json({
                error: 'Email is already registered',
            });
        }
        const userID = (0, uuid_1.v4)();
        const hashedpwd = yield bcrypt_1.default.hash(password, 5);
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const results = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .input('Name', mssql_1.default.VarChar, Name)
            .input('email', mssql_1.default.VarChar, email)
            .input('password', mssql_1.default.VarChar, hashedpwd)
            .execute('registerUser');
        return res.json({
            message: 'User registered successfully'
        });
    }
    catch (error) {
        return res.json({
            error: error,
            message: "Server error"
        });
    }
});
exports.registerUserController = registerUserController;
function checkIfEmailExists(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool
            .request()
            .input('email', mssql_1.default.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM Users WHERE email = @email');
        return result.recordset[0].count > 0;
    });
}
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const user = yield (yield pool.request().input('email', mssql_1.default.VarChar, email).input('password', mssql_1.default.VarChar, password).execute('loginUser')).recordset;
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
    var _c;
    try {
        const { userID, OTP } = req.body;
        // Check if the request body is empty
        if (!userID || !OTP) {
            return res.json({ error: "Request body is missing or empty" });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Retrieve the user's OTP from the database
        const result = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .query('SELECT OTP FROM Users WHERE userID = @userID');
        const userOTP = (_c = result.recordset[0]) === null || _c === void 0 ? void 0 : _c.OTP;
        if (!userOTP) {
            return res.json({ error: "User not found" });
        }
        // Compare the received OTP with the user's OTP
        const isMatch = yield bcrypt_1.default.compare(OTP, userOTP);
        if (isMatch) {
            // Update the user's verification status
            const updateResult = yield pool.request()
                .input('userID', mssql_1.default.VarChar, userID)
                .query('UPDATE Users SET isVerified = 1 WHERE userID = @userID AND isVerified = 0');
            const rowsAffected = updateResult.rowsAffected[0];
            if (rowsAffected > 0) {
                // Delete the OTP from the database
                yield pool.request()
                    .input('userID', mssql_1.default.VarChar, userID)
                    .query('UPDATE Users SET OTP = NULL WHERE userID = @userID');
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
const fetchAllUSersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let users = (yield pool.request().execute('getAllUsers')).recordset;
        return res.json(users);
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.fetchAllUSersController = fetchAllUSersController;
const getSingleUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.userID;
        console.log(userID);
        if (!userID)
            return res.send({ message: "Id is required" });
        const result = yield dbHelpers.execute('getSingleUser', { userID });
        res.json(result.recordset);
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.getSingleUserController = getSingleUserController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const deleteUser = yield dbHelpers.execute('deleteUser', { userID });
        if (deleteUser.rowsAffected[0] == 0) {
            return res.json({
                message: 'User not found'
            });
        }
        else {
            return res.json({
                message: 'User deleted successfully'
            });
        }
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.deleteUserController = deleteUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, email } = req.body;
        const { userID } = req.params;
        // const { error } = validateUpdateuser.validate(req.body);
        // if (error)
        //   return res.status(403).json({ success: false, message: error.details[0].message });
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const updateUsers = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .input('Name', mssql_1.default.VarChar, Name)
            .input('email', mssql_1.default.VarChar, email)
            .execute('updateUser');
        return res.json({
            message: "User updated successfully"
        });
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.updateUserController = updateUserController;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.info;
        // console.log(user);
        if (!user) {
            return res.json({
                message: "User Not Found"
            });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const userID = user.userID;
        console.log(userID);
        const result = yield dbHelpers.execute('GetUserDetails', { userID });
        const userDetails = result.recordset;
        console.log(userDetails);
        if (!userDetails) {
            return res.json({ message: 'User details not found' });
        }
        return res.json(userDetails);
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.getUserDetails = getUserDetails;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const test = req.body;
        console.log(test);
        const hashedPwd = yield bcrypt_1.default.hash(newPassword, 5);
        const result = (yield dbHelpers.execute('resetPassword', {
            email,
            newPassword: hashedPwd,
        }));
        console.log('result here', result);
        if (result.returnValue < 1) {
            return res.json({
                message: 'User not found',
            });
        }
        else {
            return res.json({
                message: 'Password updated successfully',
            });
        }
    }
    catch (error) {
        return res.json({
            error: error,
        });
    }
});
exports.resetPasswordController = resetPasswordController;
// reset password more secure
// function generateResetToken() {
//   return crypto.randomUUID().toString()
// };
// export async function saveResetToken(email, token, expiresAt) {
//   const query = 'INSERT INTO ResetPasswordToken (email, Token_value, created_at, expired_at) VALUES (?, ?, ?, ?)';
//   const values = [email, token, new Date(), expiresAt];
//   try {
//       const result = await pool.query(query, values);
//       console.log('Reset token saved in database:', result);
//   } catch (error) {
//       console.error('Error saving reset token in database:', error);
//       throw error;
//   }
// }
//  export function calculateExpirationTime() {
//   const now = new Date();
//   return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry
// }
