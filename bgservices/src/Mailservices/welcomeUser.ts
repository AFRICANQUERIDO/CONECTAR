import mssql from 'mssql';
import ejs from 'ejs';
import { sendMail } from '../Helpers/emailHelpers';
import bcrypt from 'bcrypt';
import { sqlConfig1 } from '../config/sqlconfig';

// Function to send a welcome email to users who haven't been welcomed yet
export const sendWelcomeEmails = async () => {
    let pool;
    try {
        pool = await mssql.connect(sqlConfig1);
        const users = (await pool.request().query('SELECT * FROM Users WHERE welcomed = 0')).recordset;

        for (const user of users) {
            const emailTemplateData = { Name: user.Name };
            const emailContent = await renderEmailTemplate('Template/welcomeUser.ejs', emailTemplateData);

            const mailOptions = {
                from: "wangaripauline303@gmail.com",
                to: user.email,
                subject: "Welcome to Conectar",
                html: emailContent
            };

            await sendMail(mailOptions);
            await updateUserAsWelcomed();
            console.log(`Welcome email sent to ${user.Name}`);
        }
    } catch (error) {
        console.error('Error sending welcome emails:', error);
    } finally {
        if (pool) await pool.close();
    }
};

// // Function to send OTP emails to users
// export const sendOTPEmails = async () => {
//     let pool;
//     try {
//         pool = await mssql.connect(sqlConfig1);
//         const emails = (await pool.request().query('SELECT email FROM Users')).recordset;

//         for (const { email } of emails) {
//             const OTP = generateOTP();
//             console.log(OTP);

//             const hashedOTP = await bcrypt.hash(OTP, 1);
//             console.log(hashedOTP);

//             const emailTemplateData = { OTP: OTP }; // Pass otp variable to the template data
//             const emailContent = await renderEmailTemplate('Template/OTP.ejs', emailTemplateData);

//             const mailOptions = {
//                 from: "wangaripauline303@gmail.com",
//                 to: email,
//                 subject: "OTP Verification",
//                 html: emailContent // Use emailContent generated from the template
//             };

//             await sendMail(mailOptions);
//             await saveOTPRecord(email, hashedOTP);
//             console.log(`OTP email sent to ${email}`);
//         }
//     } catch (error) {
//         console.error('Error sending OTP emails:', error);
//     } finally {
//         if (pool) await pool.close();
//     }
// };


export const sendOTPEmails = async () => {
    let pool;
    try {
        pool = await mssql.connect(sqlConfig1);
        const users = (await pool.request().query('SELECT userID, email FROM Users')).recordset; // Select userID along with email

        for (const { userID, email } of users) { // Iterate over users and extract userID and email
            const OTP = generateOTP();
            console.log(OTP);

            const hashedOTP = await bcrypt.hash(OTP, 1);
            console.log(hashedOTP);

            const emailTemplateData = { OTP: OTP }; // Pass otp variable to the template data
            const emailContent = await renderEmailTemplate('Template/OTP.ejs', emailTemplateData);

            const mailOptions = {
                from: "wangaripauline303@gmail.com",
                to: email,
                subject: "OTP Verification",
                html: emailContent // Use emailContent generated from the template
            };

            await sendMail(mailOptions);
            await saveOTPRecord(userID, hashedOTP); // Pass userID along with hashedOTP
            console.log(`OTP email sent to ${email}`);
        }
    } catch (error) {
        console.error('Error sending OTP emails:', error);
    } finally {
        if (pool) await pool.close();
    }
};


// Function to render an email template
const renderEmailTemplate = async (templatePath: string, templateData: any) => {
    try {
        return await ejs.renderFile(templatePath, templateData);
    } catch (error) {
        console.error('Error rendering email template:', error);
        throw error;
    }
};

// Function to generate a random OTP within a specified range
export const generateOTP = () => {
    const min = 1000; // Minimum value for the OTP
    const max = 9999; // Maximum value for the OTP
    return `${Math.floor(min + Math.random() * (max - min + 1))}`;
};

// Function to update user as welcomed in the database
const updateUserAsWelcomed = async () => {
    try {
        const pool = await mssql.connect(sqlConfig1);
        await pool.request()
                   .execute('UpdateUserAsWelcomed');
        await pool.close();
    } catch (error) {
        console.error('Error updating user as welcomed:', error);
        throw error;
    }
};


// Function to save hashed OTP in the Users table
const saveOTPRecord = async (userID: string, hashedOTP: string) => {
    try {
        const pool = await mssql.connect(sqlConfig1);


        // Save the hashed OTP in the Users table
        await pool.request()
            .input('userID', mssql.VarChar, userID)
            .input('hashedOTP', mssql.VarChar, hashedOTP)
            .query('UPDATE Users SET OTP = @hashedOTP WHERE userID = @userID');

        await pool.close();
        console.log('Saved hashed OTP for user:', userID);
    } catch (error) {
        console.error('Error saving hashed OTP:', error);
        throw error;
    }
};


