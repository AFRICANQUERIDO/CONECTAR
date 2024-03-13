import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import { mail_configs } from '../Interfaces/mail.configs';

dotenv.config();

function createTransporter(config: mail_configs): Transporter {
    return nodemailer.createTransport(config);
}

const configurations: mail_configs = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER || "wangaripauline303@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "sspvenqhbjoimwvd"
    }
};

export const sendMail = async (messageOptions: any): Promise<void> => {
    try {
        const transporter = createTransporter(configurations);
        await transporter.verify();
        const info = await transporter.sendMail(messageOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error; 
    }
};
