import mssql from 'mssql';
import { v4 } from 'uuid';
import { Review } from '../intefaces/review.interface';
import { sqlConfig } from '../config/sqlConfig';
import { Request, Response } from 'express';

export const createReview = async (req: Request, res: Response) => {
    try {
        const { orderID, userID, rating, reviewText }: Review = req.body;

                // Check if a review already exists for the given order and user
                const existingReview = await checkExistingReview(orderID, userID);

                if (existingReview) {
                    return res.status(400).json({ error: 'A review already exists for this order and user' });
                }

        const reviewID = v4()

        await mssql.connect(sqlConfig);

        const request = new mssql.Request();

        request.input('reviewID', mssql.VarChar, reviewID);
        request.input('orderID', mssql.VarChar, orderID);
        request.input('userID', mssql.VarChar, userID);
        request.input('rating', mssql.Int, rating);
        request.input('reviewText', mssql.VarChar, reviewText);

        // Execute the INSERT query
        const queryResult = await request.query(`
            INSERT INTO ReviewsTable (reviewID, orderID, userID, rating, reviewText)
            VALUES (@reviewID, @orderID, @userID, @rating, @reviewText)
        `);

        // Check if the review was successfully inserted
        if (queryResult.rowsAffected[0] > 0) {
            return res.status(201).json({ message: 'Review created successfully', reviewID });
        } else {
            return res.status(500).json({ error: 'Failed to create review' });
        }
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const checkExistingReview = async (orderID: string, userID: string) => {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request()
        .input('orderID', mssql.VarChar(100), orderID)
        .input('userID', mssql.VarChar(100), userID)
        .query('SELECT TOP 1 1 FROM ReviewsTable WHERE orderID = @orderID AND userID = @userID');
    return result.recordset.length > 0;
};


export const getAllReviews = async (req: Request, res: Response) => {
    try {
        // Connect to the database
        await mssql.connect(sqlConfig);

        // Create a new request object
        const request = new mssql.Request();

        // Execute the SELECT query to retrieve all reviews
        const queryResult = await request.query(`
            SELECT * FROM ReviewsTable
        `);

        // Send the retrieved reviews in the response
        res.json(queryResult.recordset);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getReviewsByOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('status', mssql.VarChar, status)
            .query('SELECT r.* FROM ReviewsTable r INNER JOIN Orders o ON r.orderID = o.orderID WHERE o.status = @status');

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching reviews by order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const calculateGigAverageRatings = async () => {
    try {
        // Connect to the database
        const pool = await mssql.connect(sqlConfig);

        // Execute the stored procedure
        const result = await pool.request().execute('CalculateGigAverageRatings');

        // Check if any rows were affected (optional)
        const rowsAffected = result.rowsAffected[0];
        if (rowsAffected === 0) {
            console.warn('No rows were affected by the stored procedure.');
        }

        // Log the result (optional)
        console.log('Result:', result);

        // Log success message
        console.log('Gig average ratings calculated successfully');

        // Return success status
        return { success: true, message: 'Gig average ratings calculated successfully' };
    } catch (error) {
        // Log error message
        console.error('Error calculating gig average ratings:', error);

        // Return error status
        return { success: false, error: 'Error calculating gig average ratings. See server logs for details.' };
    }
};