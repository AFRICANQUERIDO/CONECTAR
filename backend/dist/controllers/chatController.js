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
exports.deleteConversation = exports.updateConversation = exports.getConversationsByEmail = exports.getConversationById = exports.getMyChatList = exports.createConversation = void 0;
const uuid_1 = require("uuid");
const sqlConfig_1 = require("../config/sqlConfig");
const mssql_1 = __importDefault(require("mssql"));
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile_pic, last_message, nickname, sender_email, receiver_email } = req.body;
    // Check if all required fields are provided
    if (!profile_pic || !last_message || !nickname || !sender_email || !receiver_email) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
    }
    // Check if sender and receiver emails exist in the system
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if sender exists
        const senderExistsQuery = yield pool.request()
            .input('senderEmail', sender_email)
            .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @senderEmail');
        // Check if receiver exists
        const receiverExistsQuery = yield pool.request()
            .input('receiverEmail', receiver_email)
            .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @receiverEmail');
        // If sender or receiver does not exist, return error
        if (senderExistsQuery.recordset[0].count === 0 || receiverExistsQuery.recordset[0].count === 0) {
            return res.status(404).json({ error: 'Sender or receiver email does not exist in the system' });
        }
        // Check if conversation already exists between sender and receiver
        const existingConversation = yield pool.request()
            .input('senderEmail', sender_email)
            .input('receiverEmail', receiver_email)
            .query('SELECT TOP 1 chatId FROM Conversation WHERE (sender_email = @senderEmail AND receiver_email = @receiverEmail) OR (sender_email = @receiverEmail AND receiver_email = @senderEmail)');
        if (existingConversation.recordset.length > 0) {
            // Conversation already exists, return existing chatId
            const chatId = existingConversation.recordset[0].chatId;
            return res.status(200).json({ error: "conversation exists", chatId });
        }
        // Conversation does not exist, proceed to create a new one
        const chatId = (0, uuid_1.v4)();
        yield pool.request()
            .input('chatId', chatId)
            .input('profile_pic', profile_pic)
            .input('last_message', last_message)
            .input('nickname', nickname)
            .input('sender_email', sender_email)
            .input('receiver_email', receiver_email)
            .execute('InsertConversation');
        res.status(201).json({ chatId });
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createConversation = createConversation;
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
const getConversationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('chatId', id)
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
const getConversationsByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
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
const updateConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { profile_pic, last_message, nickname, sender_email, receiver_email } = req.body;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('profile_pic', profile_pic)
            .input('last_message', last_message)
            .input('nickname', nickname)
            .input('sender_email', sender_email)
            .input('receiver_email', receiver_email)
            .input('chatId', id)
            .query('UPDATE Conversation SET profile_pic = @profile_pic, last_message = @last_message, nickname = @nickname, sender_email = @sender_email, receiver_email = @receiver_email WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation updated successfully' });
    }
    catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateConversation = updateConversation;
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('chatId', id)
            .query('DELETE FROM Conversation WHERE chatId = @chatId');
        res.status(200).json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteConversation = deleteConversation;
