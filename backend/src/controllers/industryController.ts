import { v4 } from "uuid"
import mssql from "mssql"
import { industry } from "../intefaces/industry"
import { newIndustrySchema } from "../validators/industry"
import { sqlConfig } from "../config/sqlConfig"
import { Request, Response } from "express"

export const createIndustry = async (req: Request, res: Response) => {
    try {
        const id = v4();
        
        const { industryName }: industry = req.body;
        
        const { error } = newIndustrySchema.validate(req.body);

        if (error) {
            return res.json({ error: error });
        }

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input("industryID", mssql.VarChar, id)
            .input("industryName", mssql.VarChar, industryName)
            .execute('createIndustry');

        if (result.rowsAffected[0] > 0) {
            return res.json({
                message: "Industry created successfully",
            });
        } else {
            return res.json({
                error: "Failed to create industry"
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const getAllIndustries = async (req: Request, res:Response) => {
    try {
        const pool = await mssql.connect(sqlConfig)

        let allindustries = (await pool.request().execute('getAllIndustries')).recordset

        return res.json({
            industries: allindustries
        })
    } catch (error) {
        return res.json({error})
    }
}

export const updateIndustry = async (req:Request, res: Response) => {
    try {
        const id = req.params.id

        const {industryName}: industry = req.body

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

export const getOneIndustry = async(req: Request, res:Response)=>{
    try {
        const id = req.params.id
        const pool = await mssql.connect(sqlConfig)
        let industry = (await pool.request().input("industryID", id).execute('getOneIndustry')).recordset
        return res.json({
            industry
        })
    } catch (error) {
        return res.json({error})
    }
}

export const deleteIndustry = async(req: Request, res: Response)=>{
    try {
        const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
        .input("industryID", mssql.VarChar, id)
        .execute('deleteIndustry')).rowsAffected

        console.log(result[0]);

        if(result[0] == 0){
            return res.json({
                error: "Industry not found"
            })
        }else{
            return res.json({
                message: "Industry deleted successfully"
            })
        }
    } catch (error) {
        return res.json({error})
    }
}

export const deActivateIndustry = async(req: Request, res: Response)=>{
    try {
        const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
        .input("industryID", mssql.VarChar, id)
        .execute('deActivate')).rowsAffected

        console.log(result[0]);

        if(result[0] == 0){
            return res.json({
                error: "Industry not found"
            })
        }else{
            return res.json({
                message: "Industry deleted successfully"
            })
        }
    } catch (error) {
        return res.json({error})
    }
}