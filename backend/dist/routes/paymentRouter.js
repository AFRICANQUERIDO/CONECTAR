"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post('/payment', paymentController_1.processPayment);
paymentRouter.get('/:orderID', paymentController_1.getPaymentsByOrderID);
exports.default = paymentRouter;
