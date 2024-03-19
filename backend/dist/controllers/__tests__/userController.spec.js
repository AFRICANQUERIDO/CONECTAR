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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
describe('validateUser', () => {
    let req;
    let res;
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    // Mock the mssql module
    jest.mock('mssql', () => ({
        connect: jest.fn().mockResolvedValue({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [{ OTP: 'validOTP' }] }),
            execute: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        }),
    }));
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            json: jsonMock,
            status: statusMock,
        };
        jest.clearAllMocks();
    });
    it('should return an error if request body is missing or empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, authController_1.validateUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request body is missing or empty' });
    }));
    it('should validate user with correct OTP', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request object with correct userID and OTP
        const req = { body: { userID: 'user123', OTP: 'validOTP' } };
        const res = { json: jest.fn() }; // Mock response object
        yield (0, authController_1.validateUser)(req, res);
        // Assert that the response contains the success message
        expect(res.json).toHaveBeenCalledWith({ success: "Email successfully validated and OTP deleted" });
    }));
    it('should handle case where OTP is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request object with incorrect OTP
        const req = { body: { userID: 'user123', OTP: 'invalidOTP' } };
        const res = { json: jest.fn() }; // Mock response object
        yield (0, authController_1.validateUser)(req, res);
        // Assert that the response contains the error message for invalid OTP
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid OTP" });
    }));
    it('should handle case where user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request object with unknown user
        const req = { body: { userID: 'unknownUser', OTP: 'validOTP' } };
        const res = { json: jest.fn() }; // Mock response object
        yield (0, authController_1.validateUser)(req, res);
        // Assert that the response contains the error message for user not found
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    }));
    it('should handle internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request object with internal server error
        const req = { body: { userID: 'user123', OTP: 'validOTP' } };
        const res = { json: jest.fn() }; // Mock response object
        const mockMssql = mssql_1.default;
        // Mocking the execute function to throw an error
        mockMssql.connect.mockImplementation(() => {
            throw new Error('Internal server error');
        });
        yield (0, authController_1.validateUser)(req, res);
        // Assert that the response contains the error message for internal server error
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    }));
});
describe('loginUserController', () => {
    // Mock the mssql module
    jest.mock('mssql', () => ({
        connect: jest.fn(),
    }));
    // Mock the bcrypt module
    jest.mock('bcrypt', () => ({
        compare: jest.fn(),
    }));
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password'
            }
        };
        res = {
            json: jest.fn()
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return user logged in successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockedUser = {
            email: 'test@example.com',
            password: 'hashedPassword',
            isVerified: true,
            // Add other user properties as needed
        };
        // Mock the mssql connection
        mssql_1.default.connect.mockResolvedValue({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({ recordset: [mockedUser] }),
        });
        // Mock bcrypt compare to return true
        bcrypt_1.default.compare.mockResolvedValue(true);
        yield (0, authController_1.loginUserController)(req, res);
        // Expectations
        expect(res.json).toHaveBeenCalledWith({
            message: 'User Logged in successfully',
            email: 'test@example.com',
            isVerified: true,
            token: expect.any(String),
        });
    }));
    // To add test cases for other scenarios ( user not found, incorrect password, etc.)
});
