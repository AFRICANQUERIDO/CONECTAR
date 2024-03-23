import { Router } from "express";
import { deleteUserController, fetchAllUSersController, getSingleUserController, getUserDetails, registerUserController, resetPasswordController, setRole, updateUserController } from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";
import { checkUserDetails, loginUserController, validateUser } from "../controllers/authController";
import { createProfile } from "../controllers/profile.controller";
import { verifyAdminToken } from "../middlewares/verifyRoleToken";


const userRouter = Router()

userRouter.post('/role/:id', setRole);
userRouter.post('/register', registerUserController)
// userRouter.post('/', generateOTP)
userRouter.put('/validate/:id', validateUser)
userRouter.post('/login', loginUserController)
userRouter.put('/profile',verifyToken, createProfile)
userRouter.get('/checkdetails', verifyToken, checkUserDetails)
userRouter.post('/resetPWD', verifyToken, resetPassword)
userRouter.get('/:userID', verifyToken, getSingleUserController)
userRouter.delete('/delete/:userID', verifyAdminToken, deleteUserController)
userRouter.get('/', verifyToken,fetchAllUSersController)
userRouter.get('/userDetails', verifyAdminToken, getUserDetails)

// userRouter.put('/update/:userID', updateUserController)

export default userRouter