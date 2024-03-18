import { v4 } from "uuid"
import mssql from "mssql"
import { industry } from "../intefaces/industry"
import { newIndustrySchema } from "../validators/industry.validator"
import { sqlConfig } from "../config/sqlConfig"
import { Request, Response } from "express"

export const createIndustry = async (req: Request, res: Response) => {
    try {
        const { industryName }: industry = req.body;

        // Validate the incoming request body
        const { error } = newIndustrySchema.validate(req.body);

        if (error) {
            // Return validation error message
            return res.json({ error: error.message });
        }

        const pool = await mssql.connect(sqlConfig)

        // Check if the industry already exists
        const existingIndustry = await pool.request()
            .input('industryName', mssql.VarChar, industryName)
            .query('SELECT TOP 1 * FROM industry WHERE industryName = @industryName');

        if (existingIndustry.recordset.length > 0) {
            // Return error message if the industry already exists
            return res.json({ error: 'Opps Industry already exists' });
        }

        // Generate a new ID for the industry
        const id = v4();

        // Create the industry
        const result = await pool.request()
            .input("industryID", mssql.VarChar, id)
            .input("industryName", mssql.VarChar, industryName)
            .execute('createIndustry');

        if (result.rowsAffected[0] > 0) {
            // Return success message if the industry is created successfully
            return res.json({ message: "Industry created successfully" });
        } else {
            // Return generic error message if creating the industry fails
            return res.json({ error: "Failed to create industry" });
        }
    } catch (error) {
        // Return error message for internal server errors
        console.error("Error creating industry:", error);
        return res.json({ error: "Internal server error" });
    }
}

export const getAllIndustries = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig)

        let allindustries = (await pool.request().execute('getAllIndustries')).recordset

        return res.json({
            industries: allindustries
        })
    } catch (error) {
        return res.json({ error })
    }
}

export const updateIndustry = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const { industryName }: industry = req.body

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
            .input("industryID", id)
            .input("industryName", mssql.VarChar, industryName)
            .execute('updateIndustry')).rowsAffected

        console.log(result);

        return res.json({
            message: "Industry updated successfully"
        })
    } catch (error) {

    }
}

export const getOneIndustry = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const pool = await mssql.connect(sqlConfig)
        let industry = (await pool.request().input("industryID", id).execute('getOneIndustry')).recordset
        return res.json({
            industry
        })
    } catch (error) {
        return res.json({ error })
    }
}

export const deleteIndustry = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
            .input("industryID", mssql.VarChar, id)
            .execute('deleteIndustry')).rowsAffected

        console.log(result[0]);

        if (result[0] == 0) {
            return res.json({
                error: "Industry not found"
            })
        } else {
            return res.json({
                message: "Industry deleted successfully"
            })
        }
    } catch (error) {
        return res.json({ error })
    }
}

export const deActivateIndustry = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
            .input("industryID", mssql.VarChar, id)
            .execute('deActivate')).rowsAffected

        console.log(result[0]);

        if (result[0] == 0) {
            return res.json({
                error: "Industry not found"
            })
        } else {
            return res.json({
                message: "Industry deleted successfully"
            })
        }
    } catch (error) {
        return res.json({ error })
    }
}