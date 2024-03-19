import { v4 as uuid } from 'uuid';
import mssql from 'mssql';

import { Request, Response } from 'express';
import { sqlConfig } from '../config/sqlConfig';
import { sector } from '../intefaces/sector.interface';


export const createSector = async (req: Request, res: Response) => {
    try {
        const { sectorName, industryID }: sector = req.body;
        const pool = await mssql.connect(sqlConfig);
        
        // Check if the industry exists
        const industryExistsQuery = `
            SELECT COUNT(*) AS industryCount
            FROM industry
            WHERE industryID = @industryID;
        `;
        const industryExistsResult = await pool.request()
            .input('industryID', mssql.VarChar, industryID)
            .query(industryExistsQuery);

        const industryCount = industryExistsResult.recordset[0].industryCount;
        if (industryCount === 0) {
            return res.status(404).json({ error: 'Industry not found' });
        }

        // Check if the sector name already exists in any industry
        const sectorExistsQuery = `
            SELECT COUNT(*) AS sectorCount
            FROM sectors
            WHERE sectorName = @sectorName;
        `;
        const sectorExistsResult = await pool.request()
            .input('sectorName', mssql.VarChar, sectorName)
            .query(sectorExistsQuery);

        const sectorCount = sectorExistsResult.recordset[0].sectorCount;
        if (sectorCount > 0) {
            return res.status(400).json({ error: 'Sector name already exists' });
        }

        // If the industry exists and the sector name is unique, proceed with sector creation
        const sectorID = uuid();
        const createSectorResult = await pool.request()
            .input('sectorID', mssql.VarChar, sectorID)
            .input('sectorName', mssql.VarChar, sectorName)
            .input('industryID', mssql.VarChar, industryID)
            .execute('createSector');

        if (createSectorResult.rowsAffected[0] > 0) {
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
        const  industryID = req.params.id;
        const pool = await mssql.connect(sqlConfig);

        // Check if the industry exists
        const industryExistsQuery = `
            SELECT * 
            FROM industry
            WHERE industryID = @industryID;
        `;
        const industryExistsResult = (await pool.request()
            .input('industryID', mssql.VarChar, industryID)
            .query('SELECT * FROM industry WHERE industryID = @industryID')).recordset;

        const industryCount = industryExistsResult.length;
        if (industryCount < 1) {
            return res.status(404).json({ error: 'Industry not found' });
        }

        // Fetch all sectors belonging to the industry
        const allSectorsQuery = `
            SELECT *
            FROM sectors
            WHERE industryID = @industryID;
        `;
        const allSectorsResult = await pool.request()
            .input('industryID', mssql.VarChar, industryID)
            .query(allSectorsQuery);

        const allSectors = allSectorsResult.recordset;

        return res.json({ sectors: allSectors });
    } catch (error) {
        console.error('Error fetching sectors by industry:', error);
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
