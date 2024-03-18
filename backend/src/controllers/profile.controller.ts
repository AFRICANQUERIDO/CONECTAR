import mssql from 'mssql';
import { Request, Response } from "express";
import { v4 } from 'uuid';

import { profileSchema } from '../validators/specialist-det.validator';
import { sqlConfig } from '../config/sqlConfig';
import { profileInterface } from '../intefaces/profile.interface';




export const createProfile = async (req: Request, res: Response) => {

    try{
        const {photo,role,experience, education, languages,location, skills, description,hourlyRate }:profileInterface= req.body;
       console.log(req.body);

       const specialist_id = req.params.id
       
        let { error } = profileSchema.validate(req.body)
        if (error) {
            return res.json({
                error: error.details[0].message
            })
        }

            else {
                const id = v4();
                const pool = await mssql.connect(sqlConfig)

                const newProfile= (await pool.request()
                .input("profile_id", mssql.VarChar, id)
                .input("specialist_id", mssql.VarChar, specialist_id)  
                .input("photo", mssql.VarChar, photo)
                .input("role", mssql.VarChar, role)
                .input("experience", mssql.VarChar, experience)
                .input("location", mssql.VarChar, location)
                .input("education", mssql.VarChar, education)
                .input("languages", mssql.VarChar, languages)
                .input("skills", mssql.VarChar, skills)
                .input("hourlyRate", mssql.VarChar, hourlyRate)
                .input("description", mssql.VarChar, description)
                .execute('createProfile')
                ).rowsAffected; 

                console.log(newProfile);

                if (newProfile) {
                    return res.json({
                        message: "New profile created successfully",
                    });
                } else {
                    return res.json({ error: "An error occurred while creating profile." });
                }
            }
        }
    //catch block
    catch (error) {
        console.error("Error creating profile:", error);
        return res.json({ error: " The profile was not created." });
    }
};

 

// Get all Profiles
export const getProfiles = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const query = `
            SELECT
                p.profile_id,
                p.specialist_id,
                p.photo,
                p.role,
                p.experience,
                p.education,
                p.location,
                p.languages,
                p.skills,
                p.description,
                p.hourlyRate,
                s.firstName,
                s.email,
                s.phone
            FROM
                Profiles p
            INNER JOIN
                Specialist s ON p.specialist_id = s.specialist_id
            WHERE
                p.isDeleted = 0;`;

        const allProfiles = await pool.request().query(query);
        return res.json({ message: allProfiles.recordset });
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return res.status(500).json({ error: "An error occurred while fetching profiles." });
    }
};


// Get Profile by ID
export const getProfileById = async (req: Request, res: Response) => {
    try {
        const profile_id = req.params.profile_id;
        const pool = await mssql.connect(sqlConfig);
        const profile = (await pool.request().input("profile_id", mssql.VarChar, profile_id).execute('getProfileById')).recordset;
        return res.json({ 
         
            message:profile 
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ error: "An error occurred while fetching profile." });
    }
};



// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const profile_id = req.params.profile_id;
        const { photo, role, experience, education, languages, location, skills, description, hourlyRate }: profileInterface = req.body;
        // Validate profile data
        const { error } = profileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const pool = await mssql.connect(sqlConfig);
        await pool.request()
            .input("profile_id", mssql.VarChar, profile_id)
            // .input("specialist_id", mssql.VarChar, specialist_id)
            .input("photo", mssql.VarChar, photo)
            .input("role", mssql.VarChar, role)
            .input("experience", mssql.VarChar, experience)
            .input("location", mssql.VarChar, location)
            .input("education", mssql.VarChar, education)
            .input("languages", mssql.VarChar, languages)
            .input("skills", mssql.VarChar, skills)
            .input("hourlyRate", mssql.VarChar, hourlyRate)
            .input("description", mssql.VarChar, description)
            .execute('updateProfile');

        return res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "An error occurred while updating profile." });
    }
};



// Delete Profile
export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const profile_id = req.params.profile_id;
        const pool = await mssql.connect(sqlConfig);
        await pool.request().input("profile_id", mssql.VarChar, profile_id).execute('deleteProfile');
        return res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting profile:", error);
        return res.status(500).json({ error: "An error occurred while deleting profile." });
    }
};