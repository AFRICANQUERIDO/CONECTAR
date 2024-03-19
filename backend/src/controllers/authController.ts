import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mssql from 'mssql'
import jwt from 'jsonwebtoken'
import { ExtendeUser } from "../middlewares/verifyToken";
import Connection from "../dbHelper/dbhelper";
import { sqlConfig } from "../config/sqlConfig";
// import dotenv from 'dotenv'

const dbHelpers = new Connection
export const loginUserController = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
  
      const pool = await mssql.connect(sqlConfig);
      const user = await (await pool.request().input('email', mssql.VarChar, email).input('password', mssql.VarChar, password).execute('loginUser')).recordset
      console.log(user);
  
      if (user[0]?.email == email) {
        const correctPWD = await bcrypt.compare(password, user[0]?.password);
        if (user.length < 1) {
          return res.json({
            error: "User not found"
          })
        }
  
        const isVerified = user[0].isVerified
  
        if (!isVerified) {
          return res.json({
            error: "You need to verify your email to login. Check your inbox"
          })
        }
  
        if (!correctPWD) {
          return res.json({
            error: "Incorrect Password"
          })
        }
  
        const loginCredentials = user.map((records) => {
          const { password, ...rest } = records;
          return rest
        });
  
        const token = jwt.sign(loginCredentials[0], process.env.SECRET as string, {
          expiresIn: '3600h'
        })
  
        return res.json({
          message: 'User Logged in successfully',
          token,
          ...loginCredentials[0]
        })
  
      } else {
        return res.json({
          error: "Email not found"
        })
      }
  
    } catch (error) {
      return res.json({
        error: error
      })
    }
  }
  export const validateUser = async (req: Request, res: Response) => {
    try {
      const { userID, OTP } = req.body;
  
      // Check if the request body is empty
      if (!userID || !OTP) {
        return res.json({ error: "Request body is missing or empty" });
      }
  
      const pool = await mssql.connect(sqlConfig);
  
      // Retrieve the user's OTP from the database
      const result = await pool.request()
        .input('userID', mssql.VarChar, userID)
        .query('SELECT OTP FROM Users WHERE userID = @userID');
  
      const userOTP = result.recordset[0]?.OTP;
  
      if (!userOTP) {
        return res.json({ error: "User not found" });
      }
  
      // Compare the received OTP with the user's OTP
      const isMatch = await bcrypt.compare(OTP, userOTP);
  
      if (isMatch) {
        // Update the user's verification status
        const updateResult = await pool.request()
          .input('userID', mssql.VarChar, userID)
          .query('UPDATE Users SET isVerified = 1 WHERE userID = @userID AND isVerified = 0');
  
        const rowsAffected = updateResult.rowsAffected[0];
  
        if (rowsAffected > 0) {
          // Delete the OTP from the database
          await pool.request()
            .input('userID', mssql.VarChar, userID)
            .query('UPDATE Users SET OTP = NULL WHERE userID = @userID');
  
          return res.json({
            success: "Email successfully validated and OTP deleted"
          });
        } else {
          return res.json({
            error: "Email is already verified"
          });
        }
      } else {
        return res.json({
          error: "Invalid OTP"
        });
      }
    } catch (error) {
      return res.json({ error: "Internal server error" });
    }
  };
  
  
  
  export const checkUserDetails = async (req: ExtendeUser, res: Response) => {
    if (req.info) {
      return res.json({
        info: req.info
      })
    }
  }
  
  
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const pool = await mssql.connect(sqlConfig);

        const checkEmail = `
            SELECT 
                CASE
                    WHEN EXISTS (SELECT 1 FROM Specialist WHERE email = @email) THEN 1
                    WHEN EXISTS (SELECT 1 FROM Clients WHERE email = @email) THEN 1
                    ELSE 0
                END AS userExists
        `;

        const emailCheckResult = await pool.request()
            .input("email", email)
            .query(checkEmail);

        const notExists = emailCheckResult.recordset[0].userExists;

        if (notExists === 0) {
            return res.json({
                message: "User not found"
            });
        }

        let hashedPwd = await bcrypt.hash(password, 5);

        const updatequery = `EXEC resetPassword @email, @password`;

        const updateResult = await pool.request()
            .input("email", email)
            .input("password", hashedPwd)
            .query(updatequery);

        if (updateResult.rowsAffected[0] < 1) {
            return res.json({
                message: "Failed to update password"
            });
        } else {
            return res.json({
                message: "Password updated successfully"
            });
        }

    } catch (error) {
        return res.status(501).json({
            error: 'error catch block'
        });
    }
};