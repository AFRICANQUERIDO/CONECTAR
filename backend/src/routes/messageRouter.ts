import { Router, Request, Response } from "express";

const messageRouter = Router()

messageRouter.post('/create', messageController)
messageRouter.get('/get-by-id/:id', getMessageByChatId)


messageRouter.post("/create", async (req, res) => {
    try {
        console.log(req.body)
        await messageController.createMessage(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

messageRouter.put("/update/:id", async (req: Request, res: Response) => {
    try {
        await messageController.updateMessage(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

messageRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        await messageController.deleteMessage(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default messageRouter;
