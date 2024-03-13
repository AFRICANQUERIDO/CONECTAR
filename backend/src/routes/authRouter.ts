import { Router } from "express";
import { checkUserDetails, deleteUserController, fetchAllUSersController, generateOTP, getSingleUserController, getUserDetails, loginUserController, registerUserController, resetPasswordController, updateUserController, validateUser } from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";


const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/', generateOTP)
userRouter.put('/validate/:userID', validateUser)
userRouter.post('/login', loginUserController)
userRouter.get('/userDetails', verifyToken,getUserDetails)
userRouter.get('/checkdetails', verifyToken, checkUserDetails)
userRouter.post('/resetPassword', verifyToken, resetPasswordController)
userRouter.put('/update/:userID', updateUserController)
userRouter.delete('/delete/:userID', deleteUserController)
userRouter.get('/singleUser/:userID', verifyToken,getSingleUserController)
userRouter.get('/', fetchAllUSersController)

export default userRouter