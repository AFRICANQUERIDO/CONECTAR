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
exports.deleteSector = exports.updateSector = exports.getAllSectorsByIndustry = exports.createSector = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
const createSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectorName, industryID } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if the industry exists
        const industryExistsQuery = `
            SELECT COUNT(*) AS industryCount
            FROM industry
            WHERE industryID = @industryID;
        `;
        const industryExistsResult = yield pool.request()
            .input('industryID', mssql_1.default.VarChar, industryID)
            .query(industryExistsQuery);
        const industryCount = industryExistsResult.recordset[0].industryCount;
        if (industryCount === 0) {
            return res.status(404).json({ error: 'Industry not found' });
        }
        // Check if the sector name already exists in any industry
        const sectorExistsQuery = `
            SELECT COUNT(*) AS sectorCount
            FROM Sector
            WHERE sectorName = @sectorName;
        `;
        const sectorExistsResult = yield pool.request()
            .input('sectorName', mssql_1.default.VarChar, sectorName)
            .query(sectorExistsQuery);
        const sectorCount = sectorExistsResult.recordset[0].sectorCount;
        if (sectorCount > 0) {
            return res.status(400).json({ error: 'Sector name already exists' });
        }
        // If the industry exists and the sector name is unique, proceed with sector creation
        const sectorID = (0, uuid_1.v4)();
        const createSectorResult = yield pool.request()
            .input('sectorID', mssql_1.default.VarChar, sectorID)
            .input('sectorName', mssql_1.default.VarChar, sectorName)
            .input('industryID', mssql_1.default.VarChar, industryID)
            .execute('createSector');
        if (createSectorResult.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector created successfully' });
        }
        else {
            return res.json({ error: 'Failed to create sector' });
        }
    }
    catch (error) {
        console.error('Error creating sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createSector = createSector;
const getAllSectorsByIndustry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const industryID = req.params.id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if the industry exists
        const industryExistsQuery = `
            SELECT * 
            FROM industry
            WHERE industryID = @industryID;
        `;
        const industryExistsResult = (yield pool.request()
            .input('industryID', mssql_1.default.VarChar, industryID)
            .query('SELECT * FROM industry WHERE industryID = @industryID')).recordset;
        const industryCount = industryExistsResult.length;
        if (industryCount < 1) {
            return res.status(404).json({ error: 'Industry not found' });
        }
        // Fetch all sectors belonging to the industry
        const allSectorsQuery = `
            SELECT *
            FROM Sector
            WHERE industryID = @industryID;
        `;
        const allSectorsResult = yield pool.request()
            .input('industryID', mssql_1.default.VarChar, industryID)
            .query(allSectorsQuery);
        const allSectors = allSectorsResult.recordset;
        return res.json({ sectors: allSectors });
    }
    catch (error) {
        console.error('Error fetching sectors by industry:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllSectorsByIndustry = getAllSectorsByIndustry;
const updateSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { sectorName, industryID } = req.body;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('sectorID', mssql_1.default.VarChar, id)
            .input('sectorName', mssql_1.default.VarChar, sectorName)
            .input('industryID', mssql_1.default.VarChar, industryID)
            .execute('updateSector');
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector updated successfully' });
        }
        else {
            return res.json({ error: 'Sector not found' });
        }
    }
    catch (error) {
        console.error('Error updating sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateSector = updateSector;
const deleteSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('sectorID', mssql_1.default.VarChar, id)
            .execute('deleteSector');
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector deleted successfully' });
        }
        else {
            return res.status(404).json({ error: 'Sector not found' });
        }
    }
    catch (error) {
        console.error('Error deleting sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteSector = deleteSector;
