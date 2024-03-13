import nodemailer from 'nodemailer'
import { sqlConfig } from '../config/sqlConfig';
import mssql from 'mssql'

const pool = await mssql.connect(sqlConfig)

const users = (await pool.request().query('SELECT * FROM Users WHERE welcomed = 0')).recordset

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "wangaripauline303@gmail.com",
            pass: 'your_password' 
        }
    });

    // test transporter
transporter.verify((error, success)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Ready for messages")
        console.log(success)
    }
})

const sendEmail = async(mailOptions)=>{
    try {
        await sendMail(mailOptions);
        await pool.request().query(`UPDATE Users SET welcomed = 1 WHERE userID = ${user.userID}`);
        console.log(`Email sent to ${user.Name}`);
    } catch (error) {
        console.log(error);
    }
}
    // Configure email options
    const mailOptions = {
        from: 'wangaripauline303@gmail.com', // sender email address
        to: user.email,
        subject: "Here is your OTP",
        text: `Your OTP is: ${otp}` 
    } catch (error) {
   error: "Error when generating OTP" 
}
 export sendEmail()