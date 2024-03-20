"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const authController_1 = require("../controllers/authController");
const profile_controller_1 = require("../controllers/profile.controller");
const userRouter = (0, express_1.Router)();
userRouter.post('/role/:id', userController_1.setRole);
userRouter.post('/register', userController_1.registerUserController);
// userRouter.post('/', generateOTP)
userRouter.put('/validate/:id', authController_1.validateUser);
userRouter.post('/login', authController_1.loginUserController);
userRouter.get('/userDetails', verifyToken_1.verifyToken, userController_1.getUserDetails);
userRouter.get('/checkdetails', verifyToken_1.verifyToken, authController_1.checkUserDetails);
userRouter.post('/resetPassword', verifyToken_1.verifyToken, userController_1.resetPasswordController);
userRouter.delete('/delete/:userID', verifyToken_1.verifyToken, userController_1.deleteUserController);
userRouter.get('/:userID', verifyToken_1.verifyToken, userController_1.getSingleUserController);
userRouter.get('/', userController_1.fetchAllUSersController);
userRouter.put('/profile', verifyToken_1.verifyToken, profile_controller_1.createProfile);
// userRouter.put('/update/:userID', updateUserController)
exports.default = userRouter;
