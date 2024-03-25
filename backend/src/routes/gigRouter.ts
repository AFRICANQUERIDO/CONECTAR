import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createGig, getAllGigsByUser, getAllgigs, getGigsByIndustry, getGigByID } from "../controllers/gigController";
import { verifySpecialistToken } from "../middlewares/verifyRoleToken";

const gigRouter = Router();

gigRouter.post('/create/:userID', verifyToken, createGig);
gigRouter.get('/user/:userID', getAllGigsByUser)
gigRouter.get('/', getAllgigs);
gigRouter.get('/filter/:industryID', verifyToken, getGigsByIndustry);
gigRouter.get('/:gigID', getGigByID);

export default gigRouter;
