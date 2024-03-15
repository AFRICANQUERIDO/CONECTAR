"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_spec_1 = require("../controllers/userController.spec");
const verifyToken_1 = require("../middlewares/verifyToken");
const userRouter = (0, express_1.Router)();
userRouter.post('/register', userController_spec_1.registerUserController);
// userRouter.post('/', generateOTP)
userRouter.put('/validate', userController_spec_1.validateUser);
userRouter.post('/login', userController_spec_1.loginUserController);
userRouter.get('/userDetails', verifyToken_1.verifyToken, userController_spec_1.getUserDetails);
userRouter.get('/checkdetails', verifyToken_1.verifyToken, userController_spec_1.checkUserDetails);
userRouter.post('/resetPassword', verifyToken_1.verifyToken, userController_spec_1.resetPasswordController);
userRouter.put('/update/:userID', userController_spec_1.updateUserController);
userRouter.delete('/delete/:userID', userController_spec_1.deleteUserController);
userRouter.get('/singleUser/:userID', verifyToken_1.verifyToken, userController_spec_1.getSingleUserController);
userRouter.get('/', userController_spec_1.fetchAllUSersController);
exports.default = userRouter;
