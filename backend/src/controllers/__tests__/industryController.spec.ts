import { createIndustry, getOneIndustry, getAllIndustries } from "../industryController";
import { Request, Response } from "express";


describe('createIndustry', () => {
  it('should create a new industry', async () => {
    const req: Request = { body: { industryName: "Test Industry" } } as Request;
    const res: Response = { json: jest.fn() } as unknown as Response;

    await createIndustry(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Industry created successfully",
    });
  });
});

// describe('getOneIndustry', () => {
//     const req = {
//         params:{
//             id: '4756cf7d-ff5c-4b78-965d-864691cbe560'
//         }
//     };
//     it('should get one industry by id', async () => {
//       const res: Response = { json: jest.fn() } as unknown as Response;
  
//       await getOneIndustry(req, res);
  
//       expect(res.json).toHaveBeenCalledWith({
//         industry: {
//           id: "123",
//           name: "Test Industry",
//           // Add other expected properties here
//         },
//       });
//     });
// });

// describe('getAllIndustries', () => {
//     it('should return all industries as JSON', async () => {
//       const req: Request = {} as Request;
//       const res: Response = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
  
//       // Mock the database or pool interaction to return a specific set of industries
//       // This depends on the testing framework and database interaction library being used
  
//       await getAllIndustries(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         industries:
//       });
//     });
  
//     it('should handle errors by returning an error response', async () => {
//       const req: Request = {} as Request;
//       const res: Response = { json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as Response;
  
//       // Mock the database or pool interaction to throw an error
//       // This depends on the testing framework and database interaction library being used
  
//       await getAllIndustries(req, res);
  
//     //   expect(res.json).toHaveBeenCalledWith({ error: /* Expected error message or object */ });
//     });
//   });