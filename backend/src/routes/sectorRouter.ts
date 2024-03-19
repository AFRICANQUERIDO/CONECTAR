import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createSector, deleteSector, getAllSectorsByIndustry, updateSector } from "../controllers/sectorController";


const sectorRouter = Router()

sectorRouter.post('/create', createSector)
sectorRouter.get('/:id', verifyToken, getAllSectorsByIndustry)
sectorRouter.put('/:id', verifyToken, updateSector)
sectorRouter.delete('/:id', verifyToken, deleteSector)

export default sectorRouter