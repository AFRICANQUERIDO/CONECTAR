
import { Request, Response } from "express";
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controller function to process payments
export const processPayment = async (req: Request, res: Response) => {
    try {
        const { amount, source, description } = req.body;

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
            customer: charge.customer,
            // Add any other relevant payment details here
        };

        res.status(200).json({ message: 'Payment successful', payment: paymentDetails });
    } catch (error) {
        // Handle charge failure
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment failed' });
    }
};


