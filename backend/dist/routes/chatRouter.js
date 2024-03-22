"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = __importDefault(require("../controllers/chatController"));
const chatConvestationController = new chatController_1.default();
const chatRouter = (0, express_1.Router)();
chatRouter.get("/my-conversation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello leon");
    try {
        yield chatConvestationController.getMyChatList(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
chatRouter.get("/get-by-id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatConvestationController.getConversationById(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
chatRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatConvestationController.createConversation(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
chatRouter.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatConvestationController.updateConversation(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
chatRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatConvestationController.deleteConversation(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
chatRouter.get("/get-by-email/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatConvestationController.getConversationsByEmail(req, res);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = chatRouter;
