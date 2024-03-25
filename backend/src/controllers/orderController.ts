import mssql from 'mssql';
import { v4 } from 'uuid';
import { sqlConfig } from '../config/sqlConfig';
import { Request, Response } from 'express';
import { Order } from '../intefaces/order.interface';
import { orderSchema } from '../validators/order.validator';
import Stripe from 'stripe';
import dotenv from 'dotenv'
import { processPayment } from './paymentController';

dotenv.config()

// const KEY = process.env.STRIPE_SECRET_KEY

const KEY = process.env?.['STRIPE_SECRET_KEY'] as string

const stripe = new Stripe(KEY, {
    // apiVersion: '2020-08-27',
});



export const createOrder = async (req: Request, res: Response) => {
    try {
        // Set default status to 'pending'
        req.body.status = 'pending';

        const { userID, gigID, orderDescription, startDate, endDate, quantity, totalAmount, status }: Order = req.body;
        const { error } = orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const orderID = v4();

        const pool = await mssql.connect(sqlConfig);
        const checkifOrderExists = await pool.request()
            .input('orderDescription', mssql.VarChar, orderDescription)
            .input('gigID', mssql.VarChar, gigID)
            .input('userID', mssql.VarChar, userID)
            .query('SELECT * FROM Orders WHERE orderDescription = @orderDescription AND gigID = @gigID AND userID = @userID');

        if (checkifOrderExists.rowsAffected[0]) {
            return res.json({ message: 'Order Exists' });
        }
        // Check if the gig belongs to the user
        // const checkGigOwnership = await pool.request()
        //     .input('gigID', mssql.VarChar, gigID)
        //     .input('userID', mssql.VarChar, userID)
        //     .query('SELECT * FROM Gig WHERE gigID = @gigID AND userID = @userID');

        // if (!checkGigOwnership.recordset.length) {
        //     return res.status(403).json({ error: 'Unauthorized access. The gig does not belong to the user.' });
        // }

        const result = await pool.request()
            .input('orderID', mssql.VarChar, orderID)
            .input('gigID', mssql.VarChar, gigID)
            .input('userID', mssql.VarChar, userID)
            .input('orderDescription', mssql.VarChar, orderDescription)
            .input('startDate', mssql.VarChar, startDate)
            .input('endDate', mssql.VarChar, endDate)
            .input('totalAmount', mssql.Int, totalAmount)
            .input('quantity', mssql.Int, quantity)
            .input('status', mssql.VarChar, status)
            .execute('CreateOrder');

        // Checking if the order was successfully created
        if (result.rowsAffected[0]) {
            // Call payment handling function
            // await processPayment(req, res)

            return res.json({ message: 'Order created successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to create order' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        // Connect to the database
        const pool = await mssql.connect(sqlConfig);

        // Query all orders
        const result = await pool.request().query('SELECT * FROM Orders');

        // Send the list of orders as response
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// export const createOrder = async (req: Request, res: Response) => {
//     try {
//         // Set default status to 'pending'
//         req.body.status = 'pending';

//         const { userID, gigID, orderDescription, startDate, endDate, quantity, totalAmount, status }: Order = req.body;
//         const { error } = orderSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ error: error.details[0].message });
//         }

//         // Check if the gig belongs to the user
//         const pool = await mssql.connect(sqlConfig);
//         const checkGigOwnership = await pool.request()
//             .input('gigID', mssql.VarChar, gigID)
//             .input('userID', mssql.VarChar, userID)
//             .query('SELECT * FROM Gigs WHERE gigID = @gigID AND userID = @userID');

//         if (!checkGigOwnership.recordset.length) {
//             return res.status(403).json({ error: 'Unauthorized access. The gig does not belong to the user.' });
//         }

//         const orderID = v4();

//         const result = await pool.request()
//             .input('orderID', mssql.VarChar, orderID)
//             .input('gigID', mssql.VarChar, gigID)
//             .input('userID', mssql.VarChar, userID)
//             .input('orderDescription', mssql.VarChar, orderDescription)
//             .input('startDate', mssql.VarChar, startDate)
//             .input('endDate', mssql.VarChar, endDate)
//             .input('totalAmount', mssql.Int, totalAmount)
//             .input('quantity', mssql.Int, quantity)
//             .input('status', mssql.VarChar, status)
//             .execute('CreateOrder');

//         // Checking if the order was successfully created
//         if (result.rowsAffected[0]) {
//             return res.json({ message: 'Order created successfully' });
//         } else {
//             return res.status(500).json({ error: 'Failed to create order' });
//         }
//     } catch (error) {
//         console.error('Error creating order:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// Function to handle payment processing
// export const processPayment = async (req: Request, res: Response) => {
//     try {
//         // Fetch order details from the request
//         const { orderID, totalAmount, source, description }: { orderID: string, totalAmount: number, source: string, description:string } = req.body;

//         // Example code to process payment with Stripe
//         const paymentResult = await stripe.charges.create({
//             amount: totalAmount ,
//             currency: 'usd',
//             source: source, // Payment source (e.g., token generated by Stripe.js)
//             description: 'Payment for order', 
//         });

//         // Check if payment was successful
//         if (paymentResult.status === 'succeeded') {
//             // Update order status to 'completed' in the database
//             const pool = await mssql.connect(sqlConfig);
//             const updateResult = await pool.request()
//                 .input('orderID', mssql.VarChar, orderID)
//                 .input('status', mssql.VarChar, 'completed')
//                 .query('UPDATE Orders SET status = @status WHERE orderID = @orderID');

//             if (updateResult.rowsAffected[0] > 0) {
//                 return res.json({ message: 'Payment processed successfully' });
//             } else {
//                 return res.status(500).json({ error: 'Failed to update order status' });
//             }
//         } else {
//             // Payment failed, handle error
//             return res.status(500).json({ error: 'Failed to process payment' });
//         }
//     } catch (error) {
//         console.error('Error processing payment:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };


// Controller function to get orders by user ID
export const getOrdersByUserID = async (req: Request, res: Response) => {
    try {

        const { userID } = req.params;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('userID', mssql.VarChar, userID)
            .query('SELECT * FROM Orders WHERE userID = @userID');

        // Checking if orders were found for the specified user ID
        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        } else {
            return res.status(404).json({ error: 'No orders found for the specified user ID' });
        }
    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
        return res.status(500).json({ error: 'Error fetching orders by user ID' });
    }
};


export const getOrdersByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('status', mssql.VarChar, status)
            .query('SELECT * FROM Orders WHERE status = @status');

        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        } else {
            return res.status(404).json({ error: 'No orders found for the specified status' });
        }
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        return res.status(500).json({ error: 'Error fetching orders by status' });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { orderID } = req.params;

        const { orderDescription, startDate, endDate, quantity, totalAmount, status } = req.body;

        // Connect to the database
        const pool = await mssql.connect(sqlConfig);

        // Update the order in the database
        const result = await pool.request()
            .input('orderID', mssql.VarChar, orderID)
            .input('orderDescription', mssql.VarChar, orderDescription)
            .input('startDate', mssql.VarChar, startDate)
            .input('endDate', mssql.VarChar, endDate)
            .input('quantity', mssql.Int, quantity)
            .input('totalAmount', mssql.Int, totalAmount)
            .input('status', mssql.VarChar, status)
            .query('UPDATE Orders SET orderDescription = @orderDescription, startDate = @startDate, endDate = @endDate, quantity = @quantity, totalAmount = @totalAmount, status = @status WHERE orderID = @orderID');

        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Order updated successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to update order' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { orderID } = req.params;

        // Connect to the database
        const pool = await mssql.connect(sqlConfig);

        // Check if the order exists
        const checkOrder = await pool.request()
            .input('orderID', mssql.VarChar, orderID)
            .query('SELECT * FROM Orders WHERE orderID = @orderID');

        if (checkOrder.recordset.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order status to 'cancelled'
        const updateResult = await pool.request()
            .input('orderID', mssql.VarChar, orderID)
            .input('status', mssql.VarChar, 'cancelled')
            .query('UPDATE Orders SET status = @status WHERE orderID = @orderID');

        if (updateResult.rowsAffected[0] > 0) {
            return res.json({ message: 'Order cancelled successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to cancel order' });
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
