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
exports.deleteConversation = exports.updateConversation = exports.getConversationById = exports.getConversationsByEmail = exports.getMyChatList = exports.checkExistingConversation = exports.createConversation = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const sqlConfig_1 = require("../config/sqlConfig");
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newConversation = req.body;
    try {
        const existingChatId = yield (0, exports.checkExistingConversation)(newConversation.sender_email, newConversation.receiver_email);
        if (existingChatId) {
            res.status(200).json({ chatId: existingChatId });
        }
        else {
            const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
            const newChatId = (0, uuid_1.v4)();
            yield pool.request()
                .input('user_dp', newConversation.user_dp)
                .input('last_message', newConversation.last_message)
                .input('username', newConversation.username)
                .input('chatId', newChatId)
                .input('sender_email', newConversation.sender_email)
                .input('receiver_email', newConversation.receiver_email)
                .query('INSERT INTO Conversation (user_dp, last_message, username, chatId, sender_email, receiver_email) VALUES (@user_dp, @last_message, @username, @chatId, @sender_email, @receiver_email)');
            res.status(201).json({ chatId: newChatId });
        }
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createConversation = createConversation;
const checkExistingConversation = (senderEmail, receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('senderEmail', senderEmail)
            .input('receiverEmail', receiverEmail)
            .query('SELECT chatId FROM Conversation WHERE (sender_email = @senderEmail AND receiver_email = @receiverEmail) OR (sender_email = @receiverEmail AND receiver_email = @senderEmail)');
        if (result.recordset.length > 0) {
            return result.recordset[0].chatId;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error checking existing conversation:', error);
        throw new Error('Internal server error');
    }
});
exports.checkExistingConversation = checkExistingConversation;
const getMyChatList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request().query('SELECT * FROM Conversation');
        const chatList = result.recordset;
        res.status(200).json(chatList);
    }
    catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMyChatList = getMyChatList;
const getConversationsByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('email', email)
            .query('SELECT * FROM Conversation WHERE sender_email = @email OR receiver_email = @email');
        const conversations = result.recordset;
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getConversationsByEmail = getConversationsByEmail;
const getConversationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.id;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('chatId', conversationId)
            .query('SELECT * FROM Conversation WHERE chatId = @chatId');
        const conversation = result.recordset[0];
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
        }
        else {
            res.status(200).json(conversation);
        }
    }
    catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getConversationById = getConversationById;
const updateConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.id;
    const updatedConversation = req.body;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('user_dp', updatedConversation.user_dp)
            .input('last_message', updatedConversation.last_message)
            .input('username', updatedConversation.username)
            .input('chatId', conversationId)
            .input('sender_email', updatedConversation.sender_email)
            .input('receiver_email', updatedConversation.receiver_email)
            .query('UPDATE Conversation SET user_dp = @user_dp, last_message = @last_message, username = @username, sender_email = @sender_email, receiver_email = @receiver_email WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation updated successfully' });
    }
    catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateConversation = updateConversation;
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.id;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('chatId', conversationId)
            .query('DELETE FROM Conversation WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteConversation = deleteConversation;
