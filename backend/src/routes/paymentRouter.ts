import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { processPayment } from "../controllers/paymentController";

const paymentRouter = Router()

paymentRouter.post('/payment',  processPayment)


export default paymentRouter
