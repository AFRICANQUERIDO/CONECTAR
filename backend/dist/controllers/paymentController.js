"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsByOrderID = exports.processPayment = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Controller function to process payments
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, source, description, orderID } = req.body; // Removed 'customer' from here
        // Create a charge using the Stripe SDK
        const charge = yield stripe.charges.create({
            amount,
            currency: 'usd',
            source,
            description,
        });
        // Handle successful charge
        const paymentDetails = {
            paymentId: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            description: charge.description,
            orderID: orderID // Assuming orderID is included in req.body
        };
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        if (!pool) {
            throw new Error('Database pool is not initialized.');
        }
        const orderResults = yield pool.query(`SELECT * FROM Orders WHERE orderID = '${paymentDetails.orderID}'`);
        const orderAmount = orderResults.recordset[0].totalAmount;
        // Check if the payment amount matches the order amount
        if (amount !== orderAmount) {
            return res.status(400).json({ error: 'Payment amount does not match order amount' });
        }
        // Call the stored procedure to insert payment data
        yield pool.request()
            .input('paymentID', paymentDetails.paymentId)
            .input('orderID', paymentDetails.orderID)
            .input('totalAmount', paymentDetails.amount)
            .input('paymentDate', new Date())
            .input('status', 'paid') // Add default status here
            .input('paymentMethod', 'Stripe') // Add default payment method here
            .execute('InsertPayment');
        res.status(200).json({ message: 'Payment successful', payment: paymentDetails });
    }
    catch (error) {
        // Handle charge failure
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment failed' });
    }
});
exports.processPayment = processPayment;
const getPaymentsByOrderID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID } = req.params; // Assuming orderID is passed as a route parameter
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('orderID', mssql_1.default.VarChar, orderID)
            .query('SELECT * FROM Payment WHERE orderID = @orderID');
        const payments = result.recordset;
        res.status(200).json({ payments });
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});
exports.getPaymentsByOrderID = getPaymentsByOrderID;
