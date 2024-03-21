import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getPaymentsByOrderID, processPayment } from "../controllers/paymentController";

const paymentRouter = Router()

paymentRouter.post('/payment',  processPayment)
paymentRouter.get('/:orderID', getPaymentsByOrderID)


export default paymentRouter
