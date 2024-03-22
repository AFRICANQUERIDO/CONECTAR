import { Router, Request, Response } from "express";
import ChatController from "../controllers/chatController";


const chatConvestationController = new ChatController();
const chatRouter = Router();

chatRouter.get("/my-conversation", async (req: Request, res: Response) => {
    console.log("hello leon");
    try {
        await chatConvestationController.getMyChatList(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


chatRouter.get("/get-by-id/:id", async (req: Request, res: Response) => {
    try {
        await chatConvestationController.getConversationById(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

chatRouter.post("/create", async (req: Request, res: Response) => {
    try {
        await chatConvestationController.createConversation(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

chatRouter.put("/update/:id", async (req: Request, res: Response) => {
    try {
        await chatConvestationController.updateConversation(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

chatRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        await chatConvestationController.deleteConversation(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

chatRouter.get("/get-by-email/:email", async (req: Request, res: Response) => {
    try {
        await chatConvestationController.getConversationsByEmail(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default chatRouter;
