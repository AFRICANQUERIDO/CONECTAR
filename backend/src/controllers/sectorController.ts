import { v4 as uuid } from 'uuid';
import mssql from 'mssql';

import { Request, Response } from 'express';
import { sqlConfig } from '../config/sqlConfig';
import { sector } from '../intefaces/sector.interface';


// Function to create a new sector for a specific industry
export const createSector = async (req: Request, res: Response) => {
    try {
        const { sectorName, industryID }: sector = req.body;
        const pool = await mssql.connect(sqlConfig);
        
        const sectorID = uuid();

        const result = await pool.request()
            .input('sectorID', mssql.VarChar, sectorID)
            .input('sectorName', mssql.VarChar, sectorName)
            .input('industryID', mssql.VarChar, industryID)
            .execute('createSector');

        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector created successfully' });
        } else {

            return res.json({ error: 'Failed to create sector' });
        }
    } catch (error) {
        console.error('Error creating sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const getAllSectorsByIndustry = async (req: Request, res: Response) => {
    try {
        const { industryID } = req.params;
        const pool = await mssql.connect(sqlConfig);

        const allSectors = (await pool.request()
            .input('industryID', mssql.VarChar, industryID)
            .execute('getAllSectorsByIndustry')).recordset;

        return res.json({ sectors: allSectors });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateSector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sectorName, industryID }: sector = req.body;
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('sectorID', mssql.VarChar, id)
            .input('sectorName', mssql.VarChar, sectorName)
            .input('industryID', mssql.VarChar, industryID)
            .execute('updateSector');

        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector updated successfully' });
        } else {
            return res.json({ error: 'Sector not found' });
        }
    } catch (error) {
        console.error('Error updating sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteSector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('sectorID', mssql.VarChar, id)
            .execute('deleteSector');

        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Sector deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Sector not found' });
        }
    } catch (error) {
        console.error('Error deleting sector:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
