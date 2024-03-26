import { Router } from "express";
// import {verifyToken} from "../middlewares/verifyToken"
import { cancelOrder, createOrder, getOrders, getOrdersByStatus, getOrdersByUserID, updateOrder, getOrderByID } from '../controllers/orderController'

const orderRouter = Router()

orderRouter.post('/create', createOrder)
orderRouter.get('/', getOrders)
orderRouter.get('/:userID', getOrdersByUserID)
orderRouter.get('/status/:status', getOrdersByStatus);
orderRouter.put('/update/:orderID', updateOrder);
orderRouter.get('/order/:orderID', getOrderByID);
orderRouter.put('/cancel/:orderID', cancelOrder);

export default orderRouter
