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
exports.deleteCustomer = exports.updateCustomer = exports.getOneCustomer = exports.getAllCustomer = exports.registerCustomer = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Prof_details_validator_1 = require("../validators/Prof-details.validator");
const sqlConfig_1 = require("../config/sqlConfig");
const registerCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, email, password, phone } = req.body;
        let { error } = Prof_details_validator_1.clientSchema.validate(req.body);
        if (error) {
            return res.json({
                error: error.details[0].message
            });
        }
        else {
            const emailExists = yield checkIfEmailExists(email);
            if (emailExists) {
                return res.json({
                    error: 'Email is already registered',
                });
            }
            else {
                const id = (0, uuid_1.v4)();
                const hashPwd = yield bcrypt_1.default.hash(password, 5);
                const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
                const newCustomer = (yield pool.request()
                    .input("customer_id", mssql_1.default.VarChar, id)
                    .input("Name", mssql_1.default.VarChar, Name)
                    .input("email", mssql_1.default.VarChar, email)
                    .input("password", mssql_1.default.VarChar, hashPwd)
                    .input("phone", mssql_1.default.VarChar, phone)
                    .execute('createCustomer')).rowsAffected;
                console.log(newCustomer);
                if (newCustomer) {
                    return res.json({
                        message: "Account for new Customer created successfully",
                    });
                }
                else {
                    return res.json({ error: "An error occurred while registerCustomer." });
                }
            }
        }
    }
    //catch block
    catch (error) {
        console.error("Error creating Customer:", error);
        return res.json({ error: " The Customer account was not created." });
    }
});
exports.registerCustomer = registerCustomer;
//check if email exist functionallity
function checkIfEmailExists(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool
            .request()
            .input('email', mssql_1.default.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM Customers WHERE email = @email');
        return result.recordset[0].count > 0;
    });
}
//getAllCustomers
const getAllCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let allCustomer = (yield pool.request().execute('getAllCustomers')).recordset;
        return res.json({
            message: allCustomer
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getAllCustomer = getAllCustomer;
//getOneCustomer
const getOneCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.customer_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let Customer = (yield pool.request().input("customer_id", id).execute('getOneCustomer')).recordset;
        return res.json({
            Customer
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getOneCustomer = getOneCustomer;
//updateCustomer
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.customer_id;
        const { Name, email, password, phone } = req.body;
        let { error } = Prof_details_validator_1.clientSchema.validate(req.body);
        if (error) {
            return res.json({
                error: error.details[0].message
            });
        }
        else {
            const hashPwd = yield bcrypt_1.default.hash(password, 5);
            const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
            // Check if user with the provided user_id exists first
            const userExist = yield pool.request()
                .input("customer_id", id)
                .query('SELECT COUNT(*) AS userCount FROM Customer WHERE customer_id = @customer_id');
            if (userExist.recordset[0].userCount === 0) {
                return res.json({ error: "No such Customer." });
            }
            else {
                let UpdateResult = (yield pool.request()
                    .input("customer_id", mssql_1.default.VarChar, id)
                    .input("Name", mssql_1.default.VarChar, Name)
                    .input("email", mssql_1.default.VarChar, email)
                    .input("password", mssql_1.default.VarChar, hashPwd)
                    .input("phone", mssql_1.default.VarChar, phone)
                    .execute('updateCustomer')).rowsAffected;
                console.log(UpdateResult);
                return res.json({
                    message: "Customer updated successfully"
                });
            }
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.updateCustomer = updateCustomer;
//deleteCustomer
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.customer_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let result = (yield pool.request()
            .input("customer_id", mssql_1.default.VarChar, id)
            .execute('deleteCustomer')).rowsAffected;
        console.log(result[0]);
        if (result[0] == 0) {
            return res.json({
                error: "Customer not found"
            });
        }
        else {
            return res.json({
                message: "Account deleted successfully"
            });
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.deleteCustomer = deleteCustomer;
