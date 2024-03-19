import { Request, Response } from 'express';
import mssql from 'mssql';
import { createIndustry } from '../industryController';
jest.mock('mssql', () => ({
  connect: jest.fn(),
}));

describe('createIndustry', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should create a new industry successfully', async () => {
    const req = { body: { industryName: 'New Industry', industryImage:'testing Image' } } as Request;
    const res = { json: jest.fn() } as unknown as Response;
  
    // Mock the pool request to simulate a new industry
    (mssql.connect as jest.Mock).mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValueOnce({ recordset: [] }), // Simulate that industry does not exist
      execute: jest.fn().mockResolvedValueOnce({ rowsAffected: [1] }), 
    });
  
    await createIndustry(req, res);
  
    // Check if the response contains the expected message
    expect(res.json).toHaveBeenCalledWith({ message: 'Industry created successfully' });
  });
  

  it('should handle error when industry already exists', async () => {
    const req = { body: { industryName: 'Testing Industry', industryImage:'testing Image' } } as Request;
    const res = { json: jest.fn() } as unknown as Response;
  
    // Mock the pool request to simulate an existing industry
    (mssql.connect as jest.Mock).mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValueOnce({ recordset: [{ industryName: 'Testing Industry', industryImage:'testing image' }] }),
    });
  
    await createIndustry(req, res);
  
    // Check if the response contains the expected error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Opps Industry already exists' });
  });
  
  

  it('should handle error when creating industry fails', async () => {
    const req = { body: { industryName: 'Test Industry', industryImage:'testing image' } } as Request;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;

    // Mock failed SQL query execution
    (mssql.connect as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await createIndustry(req, res);

    // Check if the response contains the expected error message
    // expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  })
})