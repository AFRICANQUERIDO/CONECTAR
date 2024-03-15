"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const userRouter = (0, express_1.Router)();
userRouter.post('/register', userController_1.registerUserController);
// userRouter.post('/', generateOTP)
userRouter.put('/validate', userController_1.validateUser);
userRouter.post('/login', userController_1.loginUserController);
userRouter.get('/userDetails', verifyToken_1.verifyToken, userController_1.getUserDetails);
userRouter.get('/checkdetails', verifyToken_1.verifyToken, userController_1.checkUserDetails);
userRouter.post('/resetPassword', verifyToken_1.verifyToken, userController_1.resetPasswordController);
userRouter.put('/update/:userID', userController_1.updateUserController);
userRouter.delete('/delete/:userID', userController_1.deleteUserController);
userRouter.get('/singleUser/:userID', verifyToken_1.verifyToken, userController_1.getSingleUserController);
userRouter.get('/', userController_1.fetchAllUSersController);
exports.default = userRouter;
