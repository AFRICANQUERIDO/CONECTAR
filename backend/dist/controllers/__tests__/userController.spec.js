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
const userController_1 = require("../userController");
const mssql_1 = __importDefault(require("mssql"));
const authController_1 = require("../authController");
describe('UserController Tests', () => {
    let req;
    let res = {
        json: jest.fn()
    };
    it('registers a user', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { Name: 'John Doe', email: 'john@example.com', password: 'Password@12345' };
        yield (0, userController_1.registerUserController)(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: "Email is already registered" });
    }));
    it('should request OTP before login user', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: { email: 'correctemail@example.com', password: 'Password@12345' }
        };
        const userRecord = [{ email: 'correctemail@example.com', password: '$2b$10$rQ4D2fEgIDSWfUz5l6/viOK5yB1LP4ITe7iP4pVkq4DNmPzZ0OIMy', isVerified: false }];
        const mockedRecordset = { recordset: userRecord };
        const mockedRequest = jest.fn().mockResolvedValueOnce(mockedRecordset);
        const mockedPool = { request: mockedRequest };
        jest.spyOn(mssql_1.default, 'connect').mockResolvedValueOnce(mockedPool);
        yield (0, authController_1.loginUserController)(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: "You need to verify your email to login. Check your inbox" });
    }));
});
