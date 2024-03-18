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
exports.deActivateIndustry = exports.deleteIndustry = exports.getOneIndustry = exports.updateIndustry = exports.getAllIndustries = exports.createIndustry = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const industry_validator_1 = require("../validators/industry.validator");
const sqlConfig_1 = require("../config/sqlConfig");
const createIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { industryName } = req.body;
        // Validate the incoming request body
        const { error } = industry_validator_1.newIndustrySchema.validate(req.body);
        if (error) {
            // Return validation error message
            return res.json({ error: error.message });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if the industry already exists
        const existingIndustry = yield pool.request()
            .input('industryName', mssql_1.default.VarChar, industryName)
            .query('SELECT TOP 1 * FROM industry WHERE industryName = @industryName');
        if (existingIndustry.recordset.length > 0) {
            // Return error message if the industry already exists
            return res.json({ error: 'Opps Industry already exists' });
        }
        // Generate a new ID for the industry
        const id = (0, uuid_1.v4)();
        // Create the industry
        const result = yield pool.request()
            .input("industryID", mssql_1.default.VarChar, id)
            .input("industryName", mssql_1.default.VarChar, industryName)
            .execute('createIndustry');
        if (result.rowsAffected[0] > 0) {
            // Return success message if the industry is created successfully
            return res.json({ message: "Industry created successfully" });
        }
        else {
            // Return generic error message if creating the industry fails
            return res.json({ error: "Failed to create industry" });
        }
    }
    catch (error) {
        // Return error message for internal server errors
        console.error("Error creating industry:", error);
        return res.json({ error: "Internal server error" });
    }
});
exports.createIndustry = createIndustry;
const getAllIndustries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let allindustries = (yield pool.request().execute('getAllIndustries')).recordset;
        return res.json({
            industries: allindustries
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getAllIndustries = getAllIndustries;
const updateIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { industryName } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let result = (yield pool.request()
            .input("industryID", id)
            .input("industryName", mssql_1.default.VarChar, industryName)
            .execute('updateIndustry')).rowsAffected;
        console.log(result);
        return res.json({
            message: "Industry updated successfully"
        });
    }
    catch (error) {
    }
});
exports.updateIndustry = updateIndustry;
const getOneIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let industry = (yield pool.request().input("industryID", id).execute('getOneIndustry')).recordset;
        return res.json({
            industry
        });
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.getOneIndustry = getOneIndustry;
const deleteIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let result = (yield pool.request()
            .input("industryID", mssql_1.default.VarChar, id)
            .execute('deleteIndustry')).rowsAffected;
        console.log(result[0]);
        if (result[0] == 0) {
            return res.json({
                error: "Industry not found"
            });
        }
        else {
            return res.json({
                message: "Industry deleted successfully"
            });
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.deleteIndustry = deleteIndustry;
const deActivateIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let result = (yield pool.request()
            .input("industryID", mssql_1.default.VarChar, id)
            .execute('deActivate')).rowsAffected;
        console.log(result[0]);
        if (result[0] == 0) {
            return res.json({
                error: "Industry not found"
            });
        }
        else {
            return res.json({
                message: "Industry deleted successfully"
            });
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.deActivateIndustry = deActivateIndustry;
