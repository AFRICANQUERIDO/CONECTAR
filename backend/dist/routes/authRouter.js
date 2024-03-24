"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const authController_1 = require("../controllers/authController");
const profile_controller_1 = require("../controllers/profile.controller");
const verifyRoleToken_1 = require("../middlewares/verifyRoleToken");
const userRouter = (0, express_1.Router)();
userRouter.post('/role/:id', userController_1.setRole);
userRouter.post('/register', userController_1.registerUserController);
// userRouter.post('/', generateOTP)
userRouter.put('/validate/:id', authController_1.validateUser);
userRouter.post('/login', authController_1.loginUserController);
userRouter.put('/profile/:id', verifyToken_1.verifyToken, profile_controller_1.createProfile);
userRouter.get('/checkdetails', verifyToken_1.verifyToken, authController_1.checkUserDetails);
userRouter.put('/resetPWD', userController_1.resetPasswordController);
userRouter.get('/:userID', verifyToken_1.verifyToken, userController_1.getSingleUserController);
userRouter.delete('/delete/:userID', verifyRoleToken_1.verifyAdminToken, userController_1.deleteUserController);
userRouter.get('/', verifyRoleToken_1.verifyAdminToken, userController_1.fetchAllUSersController);
userRouter.get('/userDetails', verifyRoleToken_1.verifyAdminToken, userController_1.getUserDetails);
// userRouter.put('/update/:userID', updateUserController)
exports.default = userRouter;
