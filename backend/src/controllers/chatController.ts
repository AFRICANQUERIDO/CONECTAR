import { Request, Response } from "express";
import { v4 } from 'uuid';
import { sqlConfig } from "../config/sqlConfig";
import mssql from 'mssql';
import { Conversation } from "../intefaces/chat.interface";


export const createConversation = async (req: Request, res: Response) => {
    const { profile_pic, last_message, nickname, sender_email, receiver_email }: Conversation = req.body;

    // Check if all required fields are provided
    if (!profile_pic || !last_message || !nickname || !sender_email || !receiver_email) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
    }

    // Check if sender and receiver emails exist in the system
    try {
        const pool = await mssql.connect(sqlConfig);

        // Check if sender exists
        const senderExistsQuery = await pool.request()
            .input('senderEmail', sender_email)
            .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @senderEmail');

        // Check if receiver exists
        const receiverExistsQuery = await pool.request()
            .input('receiverEmail', receiver_email)
            .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @receiverEmail');

        // If sender or receiver does not exist, return error
        if (senderExistsQuery.recordset[0].count === 0 || receiverExistsQuery.recordset[0].count === 0) {
            return res.status(404).json({ error: 'Sender or receiver email does not exist in the system' });
        }

        // Check if conversation already exists between sender and receiver
        const existingConversation = await pool.request()
            .input('senderEmail', sender_email)
            .input('receiverEmail', receiver_email)
            .query('SELECT TOP 1 chatId FROM Conversation WHERE (sender_email = @senderEmail AND receiver_email = @receiverEmail) OR (sender_email = @receiverEmail AND receiver_email = @senderEmail)');

        if (existingConversation.recordset.length > 0) {
            // Conversation already exists, return existing chatId
            const chatId = existingConversation.recordset[0].chatId;
            return res.status(200).json({ error: "conversation exists", chatId });
        }

        // Conversation does not exist, proceed to create a new one
        const chatId = v4();
        await pool.request()
            .input('chatId', chatId)
            .input('profile_pic', profile_pic)
            .input('last_message', last_message)
            .input('nickname', nickname)
            .input('sender_email', sender_email)
            .input('receiver_email', receiver_email)
            .execute('InsertConversation');

        res.status(201).json({ chatId });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMyChatList = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request().query('SELECT * FROM Conversation');
        const chatList = result.recordset;
        res.status(200).json(chatList);
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getConversationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('chatId', id)
            .query('SELECT * FROM Conversation WHERE chatId = @chatId');
        const conversation = result.recordset[0];
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
        } else {
            res.status(200).json(conversation);
        }
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getConversationsByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM Conversation WHERE sender_email = @email OR receiver_email = @email');

        const conversations = result.recordset;
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const updateConversation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { profile_pic, last_message, nickname, sender_email, receiver_email } = req.body;
    try {
        const pool = await mssql.connect(sqlConfig);
        await pool.request()
            .input('profile_pic', profile_pic)
            .input('last_message', last_message)
            .input('nickname', nickname)
            .input('sender_email', sender_email)
            .input('receiver_email', receiver_email)
            .input('chatId', id)
            .query('UPDATE Conversation SET profile_pic = @profile_pic, last_message = @last_message, nickname = @nickname, sender_email = @sender_email, receiver_email = @receiver_email WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation updated successfully' });
    } catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteConversation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pool = await mssql.connect(sqlConfig);
        await pool.request()
            .input('chatId', id)
            .query('DELETE FROM Conversation WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
