import { v4 } from "uuid";
import mssql from "mssql";
import { sqlConfig } from "../config/sqlConfig";
import { Request, Response } from "express";
import { gig } from "../intefaces/gig.interface";

export const createGig = async (req: Request, res: Response) => {
    try {
        const { gigName, gigDescription, gigImage, rate, userID }: gig = req.body;
        const pool = await mssql.connect(sqlConfig);

        const id = v4();
        const result = await pool.request()
            .input('gigID', mssql.VarChar, id)
            .input('gigName', mssql.VarChar, gigName)
            .input('gigImage', mssql.VarChar, gigImage)
            .input('gigDescription', mssql.VarChar, gigDescription)
            .input('rate', mssql.VarChar, rate)
            .input('userID', mssql.VarChar, userID)
            .execute('CreateGig');

        if (result.rowsAffected[0]) {
            return res.json({ message: 'Gig created successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to create gig' });
        }
    } catch (error) {
        console.error('Error creating gig:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllgigs = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request().execute('GetAllGigs');
        const gigs = result.recordset;
        return res.json(gigs);
    } catch (error) {
        console.error('Error getting all gigs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllGigsByUser = async (req: Request, res: Response) => {
    try {
        const { userID } = req.body; // Assuming the user ID is sent in the request body
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input('userID', mssql.VarChar, userID)
            .execute('GetAllGigsByUser');
        const gigs = result.recordset;
        return res.json(gigs);
    } catch (error) {
        console.error('Error getting gigs by user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};