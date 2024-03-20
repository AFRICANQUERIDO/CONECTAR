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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = void 0;
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Controller function to process payments
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, source, description } = req.body;
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
            customer: charge.customer,
            // Add any other relevant payment details here
        };
        res.status(200).json({ message: 'Payment successful', payment: paymentDetails });
    }
    catch (error) {
        // Handle charge failure
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Payment failed' });
    }
});
exports.processPayment = processPayment;
