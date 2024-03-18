import mssql from 'mssql';
import { Request, Response } from "express";
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { specialistSchema } from '../validators/specialist.validator';
import { sqlConfig } from '../config/sqlConfig';
import { specialistInterface } from '../intefaces/specialist.interface';




export const registerSpecialist = async (req: Request, res: Response) => {

    try{
        const { Name, email, password, photo, location, phone, education, languages, skills, role, experience, description, hourlyRate}:specialistInterface = req.body;
        let { error } = specialistSchema.validate(req.body)
        if (error) {
            return res.json({
                error: error.details[0].message
            })
        }

        else {
            const emailExists = await checkIfEmailExists(email);
            if (emailExists) {
                return res.json({
                    error: 'Email is already registered',
                });
            } 

            else {
                const id = v4();
                const hashPwd = await bcrypt.hash(password, 5)
                const pool = await mssql.connect(sqlConfig)

                const newSpecialist = (await pool.request()
                .input("specialist_id", mssql.VarChar, id) 
                .input("Name", mssql.VarChar, Name)
                                .input("email", mssql.VarChar, email)
                .input("password", mssql.VarChar, hashPwd)
                .input("phone", mssql.VarChar, phone)
                .execute('createSpecialist')
                ).rowsAffected; 

                console.log(newSpecialist);

                if (newSpecialist) {
                    return res.json({
                        message: "Account for new specialist created successfully",
                        specialist_id: id
                    });
                } else {
                    return res.json({ error: "An error occurred while registering specialist." });
                }
            }
        }
    }
  
    catch (error) {
        console.error("Error creating specialist:", error);
        return res.json({ error: " The specialist account was not created." });
    }
};

    //check if email exist functionallity
    async function checkIfEmailExists(email: string): Promise<boolean> {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('email', mssql.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM Specialist WHERE email = @email');
    
        return result.recordset[0].count > 0;
    }
    
 
 
//getAllSpecialist
export const getAllSpecialists = async (req: Request, res: Response) => {

    try {  
        const pool = await mssql.connect(sqlConfig);
        let allSpecialists = (await pool.request().execute('getAllSpecialist')).recordset

        return res.json({
            message: allSpecialists
        })
    } catch (error) {
        return res.json({error})
    }
};



//getOneSpecialist
export const getOneSpecialist = async (req: Request, res: Response) => {

    try {
        const id = req.params.specialist_id
        const pool = await mssql.connect(sqlConfig)
        let specialist = (await pool.request().input("specialist_id", id).execute('getOneSpecialist')).recordset
        return res.json({
            specialist
        })
    } catch (error) {
        return res.json({error})
    }
};



//updateUser
export const updateSpecialist = async (req: Request, res: Response) => {
    try {
        const id = req.params.specialist_id
        const { Name, email, password, phone}:specialistInterface = req.body;
        let { error } = specialistSchema.validate(req.body)
        if (error) {
            return res.json({
                error: error.details[0].message
            })
        }

    else{
       const hashPwd = await bcrypt.hash(password, 5)
        const pool = await mssql.connect(sqlConfig)

         // Check if user with the provided user_id exists first
         const userExist = await pool.request()
         .input("specialist_id", id)
         .query('SELECT COUNT(*) AS userCount FROM Specialist WHERE specialist_id = @specialist_id');
     
     if (userExist.recordset[0].userCount === 0) {
         return res.json({ error: "No such Specialist." });
     }

     else{
        let UpdateResult = (await pool.request()
        .input("specialist_id", mssql.VarChar, id) 
        .input("Name", mssql.VarChar, Name)
        .input("email", mssql.VarChar, email)
        .input("password", mssql.VarChar, hashPwd)
        .input("phone", mssql.VarChar, phone)
        .execute('updateSpecialist')).rowsAffected

        console.log(UpdateResult);
        
        return res.json({
            message: "specialist updated successfully"
        })
       }
    }

    } catch (error) {
        return res.json({error})
    }
};

//deleteUser
export const deleteSpecialist = async (req: Request, res: Response) => {

    try {
        const id = req.params.specialist_id

        const pool = await mssql.connect(sqlConfig)

        let result = (await pool.request()
        .input("specialist_id", mssql.VarChar, id)
        .execute('deleteSpecialist')
        ).rowsAffected

        console.log(result[0]);
        
        if(result[0] == 0){
            return res.json({
                error: "Specialist not found"
            })
            
        }else{
            return res.json({
                message: "Account deleted successfully"
            })
        }


    } catch (error) {
        return res.json({error})
    }
};
   