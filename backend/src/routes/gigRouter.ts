import { Router } from "express";
import {verifyToken } from "../middlewares/verifyToken";
import { createGig, getAllGigsByUser, getAllgigs,getGigsByIndustry } from "../controllers/gigController";
import { verifySpecialistToken } from "../middlewares/verifyRoleToken";


const gigRouter = Router()

gigRouter.post('/create', verifySpecialistToken, createGig)
gigRouter.get('/:userID', verifyToken, getAllGigsByUser)
gigRouter.get('/',verifyToken, getAllgigs)
gigRouter.get('/filter/:industryID',verifyToken, getGigsByIndustry)


export default gigRouter