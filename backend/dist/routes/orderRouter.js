"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import {verifyToken} from "../middlewares/verifyToken"
const orderController_1 = require("../controllers/orderController");
const orderRouter = (0, express_1.Router)();
orderRouter.post('/create', orderController_1.createOrder);
orderRouter.get('/', orderController_1.getOrders);
orderRouter.get('/:userID', orderController_1.getOrdersByUserID);
orderRouter.get('/status/:status', orderController_1.getOrdersByStatus);
orderRouter.put('/update/:orderID', orderController_1.updateOrder);
orderRouter.put('/cancel/:orderID', orderController_1.cancelOrder);
exports.default = orderRouter;
