import { Request, Response } from "express";
import { registerUserController } from '../userController';
import mssql from 'mssql'
import bcrypt from 'bcrypt'
import { loginUserController, validateUser } from "../authController";
import { any } from "joi";

describe('UserController Tests', () => {
   let req :Request;

   let res = {
      json: jest.fn()
    } as unknown as Response;



    it('registers a user', async () => {
        req.body = { Name: 'John Doe', email: 'john@example.com', password: 'Password@12345' };

        await registerUserController(req, res);

        expect(res.json).toHaveBeenCalledWith({ error: "Email is already registered" });
    });
  
    it('should request OTP before login user', async () => {
        const req: Request = {
          body: { email: 'correctemail@example.com', password: 'Password@12345' }
        } as Request;
    
        const userRecord = [{ email: 'correctemail@example.com', password: '$2b$10$rQ4D2fEgIDSWfUz5l6/viOK5yB1LP4ITe7iP4pVkq4DNmPzZ0OIMy', isVerified: false }];
        const mockedRecordset = { recordset: userRecord };
        const mockedRequest = jest.fn().mockResolvedValueOnce(mockedRecordset);
        const mockedPool = { request: mockedRequest };
        jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);
    
        await loginUserController(req, res);
    
        expect(res.json).toHaveBeenCalledWith({ error: "You need to verify your email to login. Check your inbox" });
      });

})



describe('validateUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
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

    it('should return an error if request body is missing or empty', async () => {
        await validateUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Request body is missing or empty' });
    });

    it('should validate user with correct OTP', async () => {
        // Mock request object with correct userID and OTP
        const req = { body: { userID: 'user123', OTP: 'validOTP' } } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response; // Mock response object

        await validateUser(req, res);

        // Assert that the response contains the success message
        expect(res.json).toHaveBeenCalledWith({ success: "Email successfully validated and OTP deleted" });
    });

    it('should handle case where OTP is invalid', async () => {
        // Mock request object with incorrect OTP
        const req = { body: { userID: 'user123', OTP: 'invalidOTP' } } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response; // Mock response object

        await validateUser(req, res);

        // Assert that the response contains the error message for invalid OTP
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid OTP" });
    });

    it('should handle case where user is not found', async () => {
        // Mock request object with unknown user
        const req = { body: { userID: 'unknownUser', OTP: 'validOTP' } } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response; // Mock response object

        await validateUser(req, res);

        // Assert that the response contains the error message for user not found
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it('should handle internal server error', async () => {
        // Mock request object with internal server error
        const req = { body: { userID: 'user123', OTP: 'validOTP' } } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response; // Mock response object
        const mockMssql = mssql as jest.Mocked<typeof mssql>;

        // Mocking the execute function to throw an error
        mockMssql.connect.mockImplementation(() => {
            throw new Error('Internal server error');
        });

        await validateUser(req, res);

        // Assert that the response contains the error message for internal server error
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
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
    let req: Partial<Request>;
    let res: Partial<Response>;

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

    it('should return user logged in successfully', async () => {
        const mockedUser = {
            email: 'test@example.com',
            password: 'hashedPassword',
            isVerified: true,
            // Add other user properties as needed
        };

        // Mock the mssql connection
        (mssql.connect as jest.Mock).mockResolvedValue({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({ recordset: [mockedUser] }),
        });

        // Mock bcrypt compare to return true
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        await loginUserController(req as Request, res as Response);

        // Expectations
        expect(res.json).toHaveBeenCalledWith({
            message: 'User Logged in successfully',
            email: 'test@example.com',
            isVerified: true,
            token: expect.any(String),
        });

    });

    // To add test cases for other scenarios ( user not found, incorrect password, etc.)
});