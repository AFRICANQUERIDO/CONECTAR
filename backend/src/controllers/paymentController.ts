import { Request, Response } from "express";
import mssql from "mssql";
import { sqlConfig } from "../config/sqlConfig";
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controller function to process payments
export const processPayment = async (req: Request, res: Response) => {
    try {
        const { amount, source, description, orderID } = req.body; // Removed 'customer' from here

        // Create a charge using the Stripe SDK
        const charge = await stripe.charges.create({
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

        const pool = await mssql.connect(sqlConfig);
        
        if (!pool) {
            throw new Error('Database pool is not initialized.');
        }
        const orderResults = await pool.query(`SELECT * FROM Orders WHERE orderID = '${paymentDetails.orderID}'`);
        
        // const OrderPaid = orderResults.recordset[0].status;

        if(orderResults.recordset.length > 0){
            return res.status(400).json({ error: 'Order is already paid. Another payment is not required.' });
        }
        
        // Check if the payment amount matches the order amount
        const orderAmount = orderResults.recordset[0].totalAmount;
       if (amount !== orderAmount) {
        return res.status(400).json({ error: 'Payment amount does not match order amount' });
            }

        // Call the stored procedure to insert payment data
        await pool.request()
            .input('paymentID', paymentDetails.paymentId)
            .input('orderID', paymentDetails.orderID)
            .input('totalAmount', paymentDetails.amount)
            .input('paymentDate', new Date()) 
            .input('status', 'paid') // Add default status here
            .input('paymentMethod', 'Stripe') // Add default payment method here
            .execute('InsertPayment');

        res.status(200).json({ message: 'Payment successful', payment: paymentDetails });
    } catch (error) {
        // Handle charge failure
        console.error('Error processing payment:', error);

        let message = 'An error occurred while processing your payment.'
        
        res.status(500).json({ error: message });
    }
};

export const getPaymentsByOrderID = async (req: Request, res: Response) => {
    try {
        const { orderID } = req.params; // Assuming orderID is passed as a route parameter
        
        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('orderID', mssql.VarChar, orderID)
            .query('SELECT * FROM Payment WHERE orderID = @orderID');

        const payments = result.recordset;

        res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};
