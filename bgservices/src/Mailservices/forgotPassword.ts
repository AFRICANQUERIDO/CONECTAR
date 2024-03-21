import { Request, Response } from "express";
import mssql from 'mssql'
import { config } from "dotenv";
// import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import { sqlConfig1 } from "../config/sqlConfig";
import Connection from "../dbhelper/dbhelper";


const dbHelpers = new Connection();

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        
        // Check if the email exists in the database
        const user = await dbHelpers.getUserByEmail(email)
        // if (!user) {
        //     return res.status(404).json({ error: "User not found" });
        // }

        // Generate a password reset token
        const token = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET as string, { expiresIn: '1h' });

        // Save the token to the database or a temporary storage (e.g., Redis) for validation

        // Send the password reset link or code to the user's email
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

        // Use nodemailer to send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env?.['EMAIL_USERNAME'],
                pass: process.env?.['EMAIL_PASSWORD'],
            },
        });

        const mailOptions = {
            from: process.env?.['EMAIL_USERNAME'],
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link has been sent to your email" });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ error: "Failed to send password reset email" });
    }
};



