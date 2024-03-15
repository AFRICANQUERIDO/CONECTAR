import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createIndustry, getOneIndustry, getAllIndustries, updateIndustry, deleteIndustry,deActivateIndustry } from "../controllers/industryController";


const industryRouter = Router()

industryRouter.post('/', createIndustry)
industryRouter.get('/:id', getOneIndustry)
industryRouter.get('/', getAllIndustries)
industryRouter.put('/:id', verifyToken, updateIndustry)
industryRouter.delete('/:id', verifyToken, deActivateIndustry)
industryRouter.delete('/:id', verifyToken, deleteIndustry)


export default industryRouter