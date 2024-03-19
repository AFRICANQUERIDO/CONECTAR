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
const sectorController_1 = require("../sectorController");
const mssql_1 = __importDefault(require("mssql"));
describe('Sector Controller', () => {
    let res;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });
    it('should create a new sector', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: {
                industryId: "exampleIndustryId",
                sectorName: "Example Sector"
            }
        };
        const mockedInput = jest.fn().mockReturnThis();
        const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
        const mockedRequest = { input: mockedInput, execute: mockedExecute };
        const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
        jest.spyOn(mssql_1.default, 'connect').mockResolvedValueOnce(mockedPool);
        yield (0, sectorController_1.createSector)(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: "Sector created successfully" });
    }));
    it('should retrieve sectors by industry ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { industryId: "exampleIndustryId" } };
        const mockSectors = [{ sectorId: '1', sectorName: 'Sector 1' }, { sectorId: '2', sectorName: 'Sector 2' }];
        const mockedRecordset = { recordset: mockSectors };
        const mockedRequest = jest.fn().mockResolvedValueOnce(mockedRecordset);
        const mockedPool = { request: mockedRequest };
        jest.spyOn(mssql_1.default, 'connect').mockResolvedValueOnce(mockedPool);
        yield (0, sectorController_1.getAllSectorsByIndustry)(req, res);
        expect(res.json).toHaveBeenCalledWith({ sectors: mockSectors });
    }));
    //   it('should update an existing sector', async () => {
    //     const req: Request = {
    //         params: { id: 'exampleSectorId' },
    //         body: {
    //           industryId: 'exampleIndustryId',
    //           sectorName: 'Updated Sector'
    //         }
    //       };
    //     const mockedInput = jest.fn().mockReturnThis();
    //     const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
    //     const mockedRequest = { input: mockedInput, execute: mockedExecute };
    //     const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
    //     jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);
    //     await updateSector(req, res);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Sector updated successfully' });
    //   });
    //   it('should delete an existing sector', async () => {
    //     let req: Request = {
    //         params: { id: 'exampleSectorId' }
    //       };
    //     const mockedInput = jest.fn().mockReturnThis();
    //     const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
    //     const mockedRequest = { input: mockedInput, execute: mockedExecute };
    //     const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
    //     jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);
    //     await deleteSector(req, res);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Sector deleted successfully' });
    //   });
});
