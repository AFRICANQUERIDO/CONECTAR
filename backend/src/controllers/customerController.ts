import mssql from 'mssql';
import { Request, Response } from "express";
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';


import { clientSchema } from '../validators/Prof-details.validator';
import { clientInterface } from '../intefaces/customer.interface';
import { sqlConfig } from '../config/sqlConfig';



export const registerCustomer = async (req: Request, res: Response) => {

    try{
        const { Name, email, password ,phone}:clientInterface= req.body;
        let { error } = clientSchema.validate(req.body)
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

                const newCustomer= (await pool.request()
                .input("customer_id", mssql.VarChar, id) 
                .input("Name", mssql.VarChar, Name)
                .input("email", mssql.VarChar, email)
                .input("password", mssql.VarChar, hashPwd)
                .input("phone", mssql.VarChar, phone)
                .execute('createCustomer')
                ).rowsAffected; 

                console.log(newCustomer);

                if (newCustomer) {
                    return res.json({
                        message: "Account for new Customer created successfully",
                    });
                } else {
                    return res.json({ error: "An error occurred while registerCustomer." });
                }
            }
        }
    }
    //catch block
    catch (error) {
        console.error("Error creating Customer:", error);
        return res.json({ error: " The Customer account was not created." });
    }
};

    //check if email exist functionallity
    async function checkIfEmailExists(email: string): Promise<boolean> {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool
            .request()
            .input('email', mssql.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM Customers WHERE email = @email');
    
        return result.recordset[0].count > 0;
    }
    


    
//getAllCustomers
export const getAllCustomer = async (req: Request, res: Response) => {

    try {  
        const pool = await mssql.connect(sqlConfig);
        let allCustomer = (await pool.request().execute('getAllCustomers')).recordset

        return res.json({
            message: allCustomer
        })
    } catch (error) {
        return res.json({error})
    }
};



//getOneCustomer
export const getOneCustomer = async (req: Request, res: Response) => {

    try {
        const id = req.params.customer_id
        const pool = await mssql.connect(sqlConfig)
        let Customer = (await pool.request().input("customer_id", id).execute('getOneCustomer')).recordset
        return res.json({
            Customer
        })
    } catch (error) {
        return res.json({error})
    }
};



//updateCustomer
export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const id = req.params.customer_id
        const { Name, email, password ,phone}:clientInterface= req.body;
        let { error } = clientSchema.validate(req.body)
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
         .input("customer_id", id)
         .query('SELECT COUNT(*) AS userCount FROM Customer WHERE customer_id = @customer_id');
     
     if (userExist.recordset[0].userCount === 0) {
         return res.json({ error: "No such Customer." });
     }

     else{
        let UpdateResult = (await pool.request()
        .input("customer_id", mssql.VarChar, id) 
        .input("Name", mssql.VarChar, Name)
        .input("email", mssql.VarChar, email)
        .input("password", mssql.VarChar, hashPwd)
        .input("phone", mssql.VarChar, phone)
        .execute('updateCustomer')).rowsAffected

        console.log(UpdateResult);
        
        return res.json({
            message: "Customer updated successfully"
        })
       }
    }

    } catch (error) {
        return res.json({error})
    }
};

//deleteCustomer
export const deleteCustomer = async (req: Request, res: Response) => {

    try {
        const id = req.params.customer_id
        const pool = await mssql.connect(sqlConfig)
        let result = (await pool.request()
        .input("customer_id", mssql.VarChar, id)
        .execute('deleteCustomer')
        ).rowsAffected

        console.log(result[0]);
        
        if(result[0] == 0){
            return res.json({
                error: "Customer not found"
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
   