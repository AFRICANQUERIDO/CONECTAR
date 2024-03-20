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
exports.calculateGigAverageRatings = exports.getReviewsByOrderStatus = exports.getAllReviews = exports.checkExistingReview = exports.createReview = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const sqlConfig_1 = require("../config/sqlConfig");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID, userID, rating, reviewText } = req.body;
        // Check if a review already exists for the given order and user
        const existingReview = yield (0, exports.checkExistingReview)(orderID, userID);
        if (existingReview) {
            return res.status(400).json({ error: 'A review already exists for this order and user' });
        }
        const reviewID = (0, uuid_1.v4)();
        yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const request = new mssql_1.default.Request();
        request.input('reviewID', mssql_1.default.VarChar, reviewID);
        request.input('orderID', mssql_1.default.VarChar, orderID);
        request.input('userID', mssql_1.default.VarChar, userID);
        request.input('rating', mssql_1.default.Int, rating);
        request.input('reviewText', mssql_1.default.VarChar, reviewText);
        // Execute the INSERT query
        const queryResult = yield request.query(`
            INSERT INTO ReviewsTable (reviewID, orderID, userID, rating, reviewText)
            VALUES (@reviewID, @orderID, @userID, @rating, @reviewText)
        `);
        // Check if the review was successfully inserted
        if (queryResult.rowsAffected[0] > 0) {
            return res.status(201).json({ message: 'Review created successfully', reviewID });
        }
        else {
            return res.status(500).json({ error: 'Failed to create review' });
        }
    }
    catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createReview = createReview;
const checkExistingReview = (orderID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
    const result = yield pool.request()
        .input('orderID', mssql_1.default.VarChar(100), orderID)
        .input('userID', mssql_1.default.VarChar(100), userID)
        .query('SELECT TOP 1 1 FROM ReviewsTable WHERE orderID = @orderID AND userID = @userID');
    return result.recordset.length > 0;
});
exports.checkExistingReview = checkExistingReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Create a new request object
        const request = new mssql_1.default.Request();
        // Execute the SELECT query to retrieve all reviews
        const queryResult = yield request.query(`
            SELECT * FROM ReviewsTable
        `);
        // Send the retrieved reviews in the response
        res.json(queryResult.recordset);
    }
    catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllReviews = getAllReviews;
const getReviewsByOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('status', mssql_1.default.VarChar, status)
            .query('SELECT r.* FROM ReviewsTable r INNER JOIN Orders o ON r.orderID = o.orderID WHERE o.status = @status');
        res.json(result.recordset);
    }
    catch (error) {
        console.error('Error fetching reviews by order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getReviewsByOrderStatus = getReviewsByOrderStatus;
const calculateGigAverageRatings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Execute the stored procedure
        const result = yield pool.request().execute('CalculateGigAverageRatings');
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
    }
    catch (error) {
        // Log error message
        console.error('Error calculating gig average ratings:', error);
        // Return error status
        return { success: false, error: 'Error calculating gig average ratings. See server logs for details.' };
    }
});
exports.calculateGigAverageRatings = calculateGigAverageRatings;
