import { Router, Request, Response } from "express";
import { createMessage, deleteMessage, getMessageByChatId, updateMessage } from "../controllers/messageController";

const messageRouter = Router()

messageRouter.post('/create', createMessage)
messageRouter.get('/get-by-id/:id', getMessageByChatId)
messageRouter.put('/update/:id', updateMessage)
messageRouter.delete('/delete/:id', deleteMessage)


export default messageRouter;
