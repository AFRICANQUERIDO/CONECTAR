import { Router } from "express";
import {  deleteUserController, fetchAllUSersController, getSingleUserController, getUserDetails,  registerUserController, resetPasswordController, setRole, updateUserController } from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";
import { checkUserDetails, loginUserController, validateUser } from "../controllers/authController";


const userRouter = Router()

userRouter.post('/role/:id', setRole);
userRouter.post('/register', registerUserController)
// userRouter.post('/', generateOTP)
userRouter.put('/validate/:id', validateUser)
userRouter.post('/login', loginUserController)
userRouter.get('/userDetails', verifyToken,getUserDetails)
userRouter.get('/checkdetails', verifyToken, checkUserDetails)
userRouter.post('/resetPassword', verifyToken, resetPasswordController)
userRouter.put('/update/:userID', updateUserController)
userRouter.delete('/delete/:userID', deleteUserController)
userRouter.get('/:userID', verifyToken,getSingleUserController)
userRouter.get('/', fetchAllUSersController)

export default userRouter