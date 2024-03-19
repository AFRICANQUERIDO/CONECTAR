import { createSector, getAllSectorsByIndustry, updateSector, deleteSector } from "../sectorController";
import { Request, Response } from "express";
import mssql from "mssql";

describe('Sector Controller', () => {
  let res: Response;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response;
  });

  it('should create a new sector', async () => {
    const req: Request = {
      body: {
        industryId: "exampleIndustryId",
        sectorName: "Example Sector"
      }
    } as Request;

    const mockedInput = jest.fn().mockReturnThis();
    const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
    const mockedRequest = { input: mockedInput, execute: mockedExecute };
    const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
    jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);

    await createSector(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Sector created successfully" });
  });

  it('should retrieve sectors by industry ID', async () => {
    const req: Request = { params: { industryId: "exampleIndustryId" } } as unknown as Request;
    const mockSectors = [{ sectorId: '1', sectorName: 'Sector 1' }, { sectorId: '2', sectorName: 'Sector 2' }];
    const mockedRecordset = { recordset: mockSectors };
    const mockedRequest = jest.fn().mockResolvedValueOnce(mockedRecordset);
    const mockedPool = { request: mockedRequest };
    jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);

    await getAllSectorsByIndustry(req, res);

    expect(res.json).toHaveBeenCalledWith({ sectors: mockSectors });
  });

//   it('should update an existing sector', async () => {
//     const req: Request = {
//         params: { id: 'exampleSectorId' },
//         body: {
//           industryId: 'exampleIndustryId',
//           sectorName: 'Updated Sector'
//         }
//       };

//     const mockedInput = jest.fn().mockReturnThis();
//     const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
//     const mockedRequest = { input: mockedInput, execute: mockedExecute };
//     const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
//     jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);

//     await updateSector(req, res);

//     expect(res.json).toHaveBeenCalledWith({ message: 'Sector updated successfully' });
//   });

//   it('should delete an existing sector', async () => {

//     let req: Request = {
//         params: { id: 'exampleSectorId' }
//       };

//     const mockedInput = jest.fn().mockReturnThis();
//     const mockedExecute = jest.fn().mockResolvedValueOnce({ rowsAffected: [1] });
//     const mockedRequest = { input: mockedInput, execute: mockedExecute };
//     const mockedPool = { request: jest.fn().mockReturnValue(mockedRequest) };
//     jest.spyOn(mssql, 'connect').mockResolvedValueOnce(mockedPool as never);

//     await deleteSector(req, res);

//     expect(res.json).toHaveBeenCalledWith({ message: 'Sector deleted successfully' });
//   });
});
