// // Request body validation.
// // Checking if the order already exists.
// // Verifying if the gig belongs to the user.
// // Testing successful order creation.
// // Handling server errors during order creation.

// import { createOrder } from "../orderController";

// const { Request, Response } = require('express');

// // Mocking dependencies
// jest.mock('mssql', () => ({
//   connect: jest.fn(),
// }));

// const mssql = require('mssql');

// // Mocking request and response objects
// const req = {
//   body: {
//     userID: 'user123',
//     gigID: 'gig123',
//     orderDescription: 'Test order',
//     startDate: '2024-03-20',
//     endDate: '2024-03-25',
//     quantity: 1,
//     totalAmount: 100,
//     status: 'pending',
//   },
// };

// const res:any = {
//   status: jest.fn(() => res),
//   json: jest.fn(),
// };

// describe('createOrder function', () => {
//   it('should return status 400 if request body is invalid', async () => {
//     req.body = {}; // Invalid body

//     await createOrder(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalled();
//   });

//   it('should return "Order Exists" message if order already exists', async () => {
//     // Mocking SQL query result to simulate existing order
//     mssql.connect.mockResolvedValueOnce({
//       request: jest.fn().mockResolvedValueOnce({
//         rowsAffected: [1],
//       }),
//     });

//     await createOrder(req, res);

//     expect(res.json).toHaveBeenCalledWith({ message: 'Order Exists' });
//   });

//   it('should return "Unauthorized access" error if gig does not belong to user', async () => {
//     // Mocking SQL query result to simulate gig ownership check failure
//     mssql.connect.mockResolvedValueOnce({
//       request: jest.fn().mockResolvedValueOnce({
//         recordset: [],
//       }),
//     });

//     await createOrder(req, res);

//     expect(res.status).toHaveBeenCalledWith(403);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized access. The gig does not belong to the user.' });
//   });

//   it('should return "Order created successfully" message if order creation is successful', async () => {
//     // Mocking SQL query result to simulate successful order creation
//     mssql.connect.mockResolvedValueOnce({
//       request: jest.fn().mockResolvedValueOnce({
//         rowsAffected: [1],
//       }),
//     });

//     await createOrder(req, res);

//     expect(res.json).toHaveBeenCalledWith({ message: 'Order created successfully' });
//   });

//   it('should return status 500 if there is a server error', async () => {
//     // Mocking SQL query result to simulate server error
//     mssql.connect.mockRejectedValueOnce(new Error('Database connection error'));

//     await createOrder(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
//   });
// });
