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
exports.getAllGigsByUser = exports.getAllgigs = exports.createGig = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
const createGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigName, gigDescription, gigImage, rate, userID } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const id = (0, uuid_1.v4)();
        const result = yield pool.request()
            .input('gigID', mssql_1.default.VarChar, id)
            .input('gigName', mssql_1.default.VarChar, gigName)
            .input('gigImage', mssql_1.default.VarChar, gigImage)
            .input('gigDescription', mssql_1.default.VarChar, gigDescription)
            .input('rate', mssql_1.default.VarChar, rate)
            .input('userID', mssql_1.default.VarChar, userID)
            .execute('CreateGig');
        if (result.rowsAffected[0]) {
            return res.json({ message: 'Gig created successfully' });
        }
        else {
            return res.status(500).json({ error: 'Failed to create gig' });
        }
    }
    catch (error) {
        console.error('Error creating gig:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createGig = createGig;
const getAllgigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request().execute('GetAllGigs');
        const gigs = result.recordset;
        return res.json(gigs);
    }
    catch (error) {
        console.error('Error getting all gigs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllgigs = getAllgigs;
const getAllGigsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.body; // Assuming the user ID is sent in the request body
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .execute('GetAllGigsByUser');
        const gigs = result.recordset;
        return res.json(gigs);
    }
    catch (error) {
        console.error('Error getting gigs by user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllGigsByUser = getAllGigsByUser;
