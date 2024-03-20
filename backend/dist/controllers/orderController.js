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
exports.cancelOrder = exports.updateOrder = exports.getOrdersByStatus = exports.getOrdersByUserID = exports.getOrders = exports.createOrder = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const sqlConfig_1 = require("../config/sqlConfig");
const order_validator_1 = require("../validators/order.validator");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set default status to 'pending'
        req.body.status = 'pending';
        const { userID, gigID, orderDescription, startDate, endDate, quantity, totalAmount, status } = req.body;
        const { error } = order_validator_1.orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const orderID = (0, uuid_1.v4)();
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const checkifOrderExists = yield pool.request()
            .input('orderDescription', mssql_1.default.VarChar, orderDescription)
            .input('gigID', mssql_1.default.VarChar, gigID)
            .input('userID', mssql_1.default.VarChar, userID)
            .query('SELECT * FROM Orders WHERE orderDescription = @orderDescription AND gigID = @gigID AND userID = @userID');
        if (checkifOrderExists.rowsAffected[0]) {
            return res.json({ message: 'Order Exists' });
        }
        // Check if the gig belongs to the user
        const checkGigOwnership = yield pool.request()
            .input('gigID', mssql_1.default.VarChar, gigID)
            .input('userID', mssql_1.default.VarChar, userID)
            .query('SELECT * FROM Gigs WHERE gigID = @gigID AND userID = @userID');
        if (!checkGigOwnership.recordset.length) {
            return res.status(403).json({ error: 'Unauthorized access. The gig does not belong to the user.' });
        }
        const result = yield pool.request()
            .input('orderID', mssql_1.default.VarChar, orderID)
            .input('gigID', mssql_1.default.VarChar, gigID)
            .input('userID', mssql_1.default.VarChar, userID)
            .input('orderDescription', mssql_1.default.VarChar, orderDescription)
            .input('startDate', mssql_1.default.VarChar, startDate)
            .input('endDate', mssql_1.default.VarChar, endDate)
            .input('totalAmount', mssql_1.default.Int, totalAmount)
            .input('quantity', mssql_1.default.Int, quantity)
            .input('status', mssql_1.default.VarChar, status)
            .execute('CreateOrder');
        // Checking if the order was successfully created
        if (result.rowsAffected[0]) {
            return res.json({ message: 'Order created successfully' });
        }
        else {
            return res.status(500).json({ error: 'Failed to create order' });
        }
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Query all orders
        const result = yield pool.request().query('SELECT * FROM Orders');
        // Send the list of orders as response
        return res.json(result.recordset);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getOrders = getOrders;
// Controller function to get orders by user ID
const getOrdersByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('userID', mssql_1.default.VarChar, userID)
            .query('SELECT * FROM Orders WHERE userID = @userID');
        // Checking if orders were found for the specified user ID
        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        }
        else {
            return res.status(404).json({ error: 'No orders found for the specified user ID' });
        }
    }
    catch (error) {
        console.error('Error fetching orders by user ID:', error);
        return res.status(500).json({ error: 'Error fetching orders by user ID' });
    }
});
exports.getOrdersByUserID = getOrdersByUserID;
const getOrdersByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('status', mssql_1.default.VarChar, status)
            .query('SELECT * FROM Orders WHERE status = @status');
        if (result.recordset.length > 0) {
            return res.json(result.recordset);
        }
        else {
            return res.status(404).json({ error: 'No orders found for the specified status' });
        }
    }
    catch (error) {
        console.error('Error fetching orders by status:', error);
        return res.status(500).json({ error: 'Error fetching orders by status' });
    }
});
exports.getOrdersByStatus = getOrdersByStatus;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID } = req.params;
        const { orderDescription, startDate, endDate, quantity, totalAmount, status } = req.body;
        // Connect to the database
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Update the order in the database
        const result = yield pool.request()
            .input('orderID', mssql_1.default.VarChar, orderID)
            .input('orderDescription', mssql_1.default.VarChar, orderDescription)
            .input('startDate', mssql_1.default.VarChar, startDate)
            .input('endDate', mssql_1.default.VarChar, endDate)
            .input('quantity', mssql_1.default.Int, quantity)
            .input('totalAmount', mssql_1.default.Int, totalAmount)
            .input('status', mssql_1.default.VarChar, status)
            .query('UPDATE Orders SET orderDescription = @orderDescription, startDate = @startDate, endDate = @endDate, quantity = @quantity, totalAmount = @totalAmount, status = @status WHERE orderID = @orderID');
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: 'Order updated successfully' });
        }
        else {
            return res.status(500).json({ error: 'Failed to update order' });
        }
    }
    catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateOrder = updateOrder;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderID } = req.params;
        // Connect to the database
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if the order exists
        const checkOrder = yield pool.request()
            .input('orderID', mssql_1.default.VarChar, orderID)
            .query('SELECT * FROM Orders WHERE orderID = @orderID');
        if (checkOrder.recordset.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Update the order status to 'cancelled'
        const updateResult = yield pool.request()
            .input('orderID', mssql_1.default.VarChar, orderID)
            .input('status', mssql_1.default.VarChar, 'cancelled')
            .query('UPDATE Orders SET status = @status WHERE orderID = @orderID');
        if (updateResult.rowsAffected[0] > 0) {
            return res.json({ message: 'Order cancelled successfully' });
        }
        else {
            return res.status(500).json({ error: 'Failed to cancel order' });
        }
    }
    catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.cancelOrder = cancelOrder;
