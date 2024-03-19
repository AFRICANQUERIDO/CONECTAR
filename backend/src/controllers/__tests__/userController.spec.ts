import { Request, Response } from "express";
import { registerUserController } from '../userController';
import mssql from 'mssql'
import bcrypt from 'bcrypt'

import { loginUserController, validateUser } from "../authController";

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

