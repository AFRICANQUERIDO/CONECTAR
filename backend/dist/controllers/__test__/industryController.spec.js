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
const industryController_1 = require("../industryController");
const mssql_1 = __importDefault(require("mssql"));
describe('Industy creation test suite', () => {
    let res;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        it('successfully creates an industry', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    industryName: "DataAnalysis"
                }
            };
            const mockedInput = jest.fn().mockReturnThis();
            const mockedExecute = jest.fn().mockRejectedValueOnce({ rowsAffected: [1] });
            const mockedRequest = {
                input: mockedInput,
                execute: mockedExecute
            };
            const mockedPool = {
                request: jest.fn().mockReturnValue(mockedRequest)
            };
            jest.spyOn(mssql_1.default, 'connect').mockRejectedValueOnce(mockedPool);
            yield (0, industryController_1.createIndustry)(req, res);
            expect(res.json).toHaveBeenCalledWith({ message: "Industry created successfully" });
        }));
    });
});
