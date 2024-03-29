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
exports.deleteMessage = exports.updateMessage = exports.getMessageByChatId = exports.getAllMessages = exports.updateLastMessage = exports.createMessage = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
const uuid_1 = require("uuid");
const checkUserExists = (authorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('author_email', mssql_1.default.VarChar, authorEmail)
            .query('SELECT COUNT(*) AS count FROM UserDetails WHERE email = @author_email');
        return result.recordset[0].count > 0;
    }
    catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
});
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_email, chatId, message, timestamp } = req.body;
    if (!author_email || !chatId || !message) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
    }
    // Check if the author exists in the system
    try {
        const authorExists = yield checkUserExists(author_email);
        if (!authorExists) {
            return res.status(404).json({ error: 'Author does not exist' });
        }
    }
    catch (error) {
        console.error('Error creating message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const messageId = (0, uuid_1.v4)();
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('messageId', mssql_1.default.VarChar, messageId)
            .input('author_email', mssql_1.default.VarChar, author_email)
            .input('chatId', mssql_1.default.VarChar, chatId)
            .input('message', mssql_1.default.VarChar, message)
            .query('INSERT INTO Message (messageId, author_email, chatId, message) VALUES (@messageId, @author_email, @chatId, @message)');
        (0, exports.updateLastMessage)(message, chatId);
        res.status(201).json({ messageId, message: 'Message created successfully' });
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createMessage = createMessage;
const updateLastMessage = (newLastMessage, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('newLastMessage', mssql_1.default.VarChar, newLastMessage)
            .input('chatId', mssql_1.default.VarChar, id)
            .query('UPDATE Conversation SET last_message = @newLastMessage WHERE chatId = @chatId');
    }
    catch (error) {
        console.error('Error updating last message:', error);
        throw error;
    }
});
exports.updateLastMessage = updateLastMessage;
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request().query('SELECT * FROM Message');
        const messageList = result.recordset;
        res.status(200).json(messageList);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllMessages = getAllMessages;
const getMessageByChatId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.params.id;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool.request()
            .input('chatId', chatId)
            .query('SELECT * FROM Message WHERE chatId = @chatId');
        const messages = result.recordset;
        if (messages.length === 0) {
            res.status(404).json({ error: 'No messages found for the given chatId' });
        }
        else {
            res.status(200).json(messages);
        }
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMessageByChatId = getMessageByChatId;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.id;
    const updatedMessage = req.body;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('author_email', updatedMessage.author_email)
            .input('chatId', updatedMessage.chatId)
            .input('message', updatedMessage.message)
            .input('messageId', messageId)
            .query('UPDATE Message SET author_email = @author_email, chatId = @chatId, message = @message WHERE messageId = @messageId');
        res.status(200).json({ message: 'Message updated successfully' });
    }
    catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateMessage = updateMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.id;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('id', messageId)
            .query('DELETE FROM Message WHERE messageId = @messageId');
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteMessage = deleteMessage;
