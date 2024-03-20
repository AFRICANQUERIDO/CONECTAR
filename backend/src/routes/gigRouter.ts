import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createGig, getAllGigsByUser, getAllgigs,getGigsByIndustry } from "../controllers/gigController";


const gigRouter = Router()

gigRouter.post('/create', createGig)
gigRouter.get('/:userID', getAllGigsByUser)
gigRouter.get('/', getAllgigs)
gigRouter.get('/:/industyyID', getGigsByIndustry)


export default gigRouter