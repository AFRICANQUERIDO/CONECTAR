import { Router, Request, Response } from "express";
import { createConversation, deleteConversation, getConversationById, getConversationsByEmail, getMyChatList, updateConversation } from "../controllers/chatController";



const chatRouter = Router();

chatRouter.post('/create', createConversation)
chatRouter.get('/my-conversation', getMyChatList)
chatRouter.get('/get-by-id/:id', getConversationById)
chatRouter.put('/update/:id',updateConversation )
chatRouter.delete('/delete/:id',deleteConversation )
chatRouter.get('/get-by-email/:email', getConversationsByEmail)

export default chatRouter;
