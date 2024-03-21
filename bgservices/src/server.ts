import express from 'express';
import cron from 'node-cron';
import { sendOTPEmails, sendWelcomeEmails } from './Mailservices/welcomeUser'; // Assuming sendOTP function is exported from the same file

const app = express();

const run = async () => {
    try {
        // Schedule the task to run every 50 seconds to check for new users and send welcome emails
        cron.schedule('*/50 * * * * *', async () => {
            console.log('Checking for new users...');
            await sendWelcomeEmails();
        });

        // Schedule the task to run every minute to generate OTPs and send them via email
        cron.schedule('*/5000 * * * * *', async () => {
            console.log('Running OTP generation and email sending');
            await sendOTPEmails();
        });

        console.log('Cron jobs scheduled successfully.');
    } catch (error) {
        console.error('Error scheduling cron jobs:', error);
    }
};

run();

app.listen(4200, () => {
    console.log("Server running on port 4200...");
});
