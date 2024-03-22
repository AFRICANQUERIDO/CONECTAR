import { Request, Response } from "express";
import mssql from 'mssql'
import { sqlConfig } from "../config/sqlConfig";

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM Message');
        const messageList = result.recordset;
        res.status(200).json(messageList);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

    export const getMessageByChatId = async (req: Request, res: Response) => {
        const chatId = req.params.id;
        try {
            const pool = await mssql.connect(sqlConfig);
            const result = await pool.request()
                .input('chatId', chatId)
                .query('SELECT * FROM Message WHERE chatId = @chatId');
            const messages = result.recordset;
            if (messages.length === 0) {
                res.status(404).json({ error: 'No messages found for the given chatId' });
            } else {
                res.status(200).json(messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    export const createMessage = async (req: Request, res: Response) => {

        const { newMessage } = req.body;
        if (!newMessage || !newMessage.author_email || !newMessage.chatId || !newMessage.message) {
            return res.status(400).json({ error: 'Missing required fields in the request body' });
        }
        try {
            const pool = await mssql.connect(sqlConfig);
            await pool.request()
                .input('author_email', newMessage.author_email)
                .input('chatId', newMessage.chatId)
                .input('message', newMessage.message)
                .query('INSERT INTO Message (author_email, chatId, message) VALUES (@author_email, @chatId, @message)');
            res.status(201).json({ message: 'Message created successfully' });
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    export const updateMessage = async (req: Request, res: Response) => {
        const messageId = req.params.id;
        const updatedMessage = req.body;
        try {
            const pool = await mssql.connect(sqlConfig);
            await pool.request()
                .input('author_email', updatedMessage.author_email)
                .input('chatId', updatedMessage.chatId)
                .input('message', updatedMessage.message)
                .input('id', messageId)
                .query('UPDATE Message SET author_email = @author_email, chatId = @chatId, message = @message WHERE id = @id');
            res.status(200).json({ message: 'Message updated successfully' });
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    export const deleteMessage = async (req: Request, res: Response) => {
        const messageId = req.params.id;
        try {
            const pool = await mssql.connect(sqlConfig);
            await pool.request()
                .input('id', messageId)
                .query('DELETE FROM Message WHERE id = @id');
            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
