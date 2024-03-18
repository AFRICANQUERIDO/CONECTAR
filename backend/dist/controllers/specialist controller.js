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
exports.deleteSpecialist = exports.updateSpecialist = exports.getOneSpecialist = exports.getAllSpecialists = exports.registerSpecialist = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const specialist_validator_1 = require("../validators/specialist.validator");
const sqlConfig_1 = require("../config/sqlConfig");
const registerSpecialist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, email, password, photo, location, phone, education, languages, skills, role, experience, description, hourlyRate } = req.body;
        let { error } = specialist_validator_1.specialistSchema.validate(req.body);
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
                const newSpecialist = (yield pool.request()
                    .input("specialist_id", mssql_1.default.VarChar, id)
                    .input("Name", mssql_1.default.VarChar, Name)
                    .input("email", mssql_1.default.VarChar, email)
                    .input("password", mssql_1.default.VarChar, hashPwd)
                    .input("phone", mssql_1.default.VarChar, phone)
                    .execute('createSpecialist')).rowsAffected;
                console.log(newSpecialist);
                if (newSpecialist) {
                    return res.json({
                        message: "Account for new specialist created successfully",
                        specialist_id: id
                    });
                }
                else {
                    return res.json({ error: "An error occurred while registering specialist." });
                }
            }
        }
    }
    catch (error) {
        console.error("Error creating specialist:", error);
        return res.json({ error: " The specialist account was not created." });
    }
});
exports.registerSpecialist = registerSpecialist;
//check if email exist functionallity
function checkIfEmailExists(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool
            .request()
            .input('email', mssql_1.default.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM Specialist WHERE email = @email');
        return result.recordset[0].count > 0;
    });
}
//getAllSpecialist
const getAllSpecialists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let allSpecialists = (yield pool.request().execute('getAllSpecialist')).recordset;
        return res.json({
            message: allSpecialists
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getAllSpecialists = getAllSpecialists;
//getOneSpecialist
const getOneSpecialist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.specialist_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let specialist = (yield pool.request().input("specialist_id", id).execute('getOneSpecialist')).recordset;
        return res.json({
            specialist
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getOneSpecialist = getOneSpecialist;
//updateUser
const updateSpecialist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.specialist_id;
        const { Name, email, password, phone } = req.body;
        let { error } = specialist_validator_1.specialistSchema.validate(req.body);
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
                .input("specialist_id", id)
                .query('SELECT COUNT(*) AS userCount FROM Specialist WHERE specialist_id = @specialist_id');
            if (userExist.recordset[0].userCount === 0) {
                return res.json({ error: "No such Specialist." });
            }
            else {
                let UpdateResult = (yield pool.request()
                    .input("specialist_id", mssql_1.default.VarChar, id)
                    .input("Name", mssql_1.default.VarChar, Name)
                    .input("email", mssql_1.default.VarChar, email)
                    .input("password", mssql_1.default.VarChar, hashPwd)
                    .input("phone", mssql_1.default.VarChar, phone)
                    .execute('updateSpecialist')).rowsAffected;
                console.log(UpdateResult);
                return res.json({
                    message: "specialist updated successfully"
                });
            }
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.updateSpecialist = updateSpecialist;
//deleteUser
const deleteSpecialist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.specialist_id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let result = (yield pool.request()
            .input("specialist_id", mssql_1.default.VarChar, id)
            .execute('deleteSpecialist')).rowsAffected;
        console.log(result[0]);
        if (result[0] == 0) {
            return res.json({
                error: "Specialist not found"
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
exports.deleteSpecialist = deleteSpecialist;
