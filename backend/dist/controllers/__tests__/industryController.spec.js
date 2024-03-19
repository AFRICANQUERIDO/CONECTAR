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
const mssql_1 = __importDefault(require("mssql"));
const industryController_1 = require("../industryController");
jest.mock('mssql', () => ({
    connect: jest.fn(),
}));
describe('createIndustry', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test
    });
    it('should create a new industry successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: { industryName: 'New Industry', industryImage: 'testing Image' } };
        const res = { json: jest.fn() };
        // Mock the pool request to simulate a new industry
        mssql_1.default.connect.mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValueOnce({ recordset: [] }), // Simulate that industry does not exist
            execute: jest.fn().mockResolvedValueOnce({ rowsAffected: [1] }),
        });
        yield (0, industryController_1.createIndustry)(req, res);
        // Check if the response contains the expected message
        expect(res.json).toHaveBeenCalledWith({ message: 'Industry created successfully' });
    }));
    it('should handle error when industry already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: { industryName: 'Testing Industry', industryImage: 'testing Image' } };
        const res = { json: jest.fn() };
        // Mock the pool request to simulate an existing industry
        mssql_1.default.connect.mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValueOnce({ recordset: [{ industryName: 'Testing Industry', industryImage: 'testing image' }] }),
        });
        yield (0, industryController_1.createIndustry)(req, res);
        // Check if the response contains the expected error message
        expect(res.json).toHaveBeenCalledWith({ error: 'Opps Industry already exists' });
    }));
    it('should handle error when creating industry fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: { industryName: 'Test Industry', industryImage: 'testing image' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        // Mock failed SQL query execution
        mssql_1.default.connect.mockRejectedValueOnce(new Error('Database error'));
        yield (0, industryController_1.createIndustry)(req, res);
        // Check if the response contains the expected error message
        // expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    }));
});
