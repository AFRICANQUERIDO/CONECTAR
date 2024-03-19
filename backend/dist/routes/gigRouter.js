"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gigController_1 = require("../controllers/gigController");
const gigRouter = (0, express_1.Router)();
gigRouter.post('/create', gigController_1.createGig);
gigRouter.get('/:userID', gigController_1.getAllGigsByUser);
gigRouter.get('/', gigController_1.getAllgigs);
exports.default = gigRouter;
