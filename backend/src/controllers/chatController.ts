import { Request, Response } from "express";
import mssql from 'mssql'
import { v4 as uuidv4 } from 'uuid';
import { sqlConfig } from "../config/sqlConfig";

export const createConversation  = async (req: Request, res: Response)=> {
    const newConversation = req.body;
    try {
        const existingChatId = await checkExistingConversation(newConversation.sender_email, newConversation.receiver_email);

        if (existingChatId) {
            res.status(200).json({ chatId: existingChatId });
        } else {
         const pool = await mssql.connect(sqlConfig);
            const newChatId =uuidv4()

            await pool.request()
                .input('user_dp', newConversation.user_dp)
                .input('last_message', newConversation.last_message)
                .input('username', newConversation.username)
                .input('chatId', newChatId)
                .input('sender_email', newConversation.sender_email)
                .input('receiver_email', newConversation.receiver_email)
                .query('INSERT INTO Conversation (user_dp, last_message, username, chatId, sender_email, receiver_email) VALUES (@user_dp, @last_message, @username, @chatId, @sender_email, @receiver_email)');

            res.status(201).json({ chatId: newChatId });
        }
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
 export const  checkExistingConversation =  async (senderEmail: string, receiverEmail: string): Promise<string | null> =>{
            try {
                const pool = await mssql.connect(sqlConfig);

                const result = await pool.request()
                    .input('senderEmail', senderEmail)
                    .input('receiverEmail', receiverEmail)
                    .query('SELECT chatId FROM Conversation WHERE (sender_email = @senderEmail AND receiver_email = @receiverEmail) OR (sender_email = @receiverEmail AND receiver_email = @senderEmail)');
    
                if (result.recordset.length > 0) {
                    return result.recordset[0].chatId;
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error checking existing conversation:', error);
                throw new Error('Internal server error');
            }
        }


export const getMyChatList =   async (req: Request, res: Response) => {
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
export const getConversationsByEmail =  async (req: Request, res: Response)=> {

            const email = req.params.email;
    
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

export const getConversationById =   async (req: Request, res: Response)=> {

        const conversationId = req.params.id;
        try {
            const pool = await mssql.connect(sqlConfig);

            const result = await pool.request()
                .input('chatId', conversationId)
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



 export const  updateConversation =  async(req: Request, res: Response) =>{
        const conversationId = req.params.id;
        const updatedConversation = req.body;
        try {
            const pool = await mssql.connect(sqlConfig);
            await pool.request()
                .input('user_dp', updatedConversation.user_dp)
                .input('last_message', updatedConversation.last_message)
                .input('username', updatedConversation.username)
                .input('chatId', conversationId)
                .input('sender_email', updatedConversation.sender_email)
                .input('receiver_email', updatedConversation.receiver_email)
                .query('UPDATE Conversation SET user_dp = @user_dp, last_message = @last_message, username = @username, sender_email = @sender_email, receiver_email = @receiver_email WHERE chatId = @chatId');
            res.status(200).json({ message: 'Conversation updated successfully' });
        } catch (error) {
            console.error('Error updating conversation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

export const deleteConversation =  async (req: Request, res: Response)=> {
        const conversationId = req.params.id;
        try {
            const pool = await mssql.connect(sqlConfig);
            await pool.request()
                .input('chatId', conversationId)
                .query('DELETE FROM Conversation WHERE chatId = @chatId');
            res.status(200).json({ message: 'Conversation deleted successfully' });
        } catch (error) {
            console.error('Error deleting conversation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


