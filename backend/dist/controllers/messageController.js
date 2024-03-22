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
exports.deleteMessage = exports.updateMessage = exports.createMessage = exports.getMessageByChatId = exports.getAllMessages = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
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
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newMessage } = req.body;
    if (!newMessage || !newMessage.author_email || !newMessage.chatId || !newMessage.message) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
    }
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('author_email', newMessage.author_email)
            .input('chatId', newMessage.chatId)
            .input('message', newMessage.message)
            .query('INSERT INTO Message (author_email, chatId, message) VALUES (@author_email, @chatId, @message)');
        res.status(201).json({ message: 'Message created successfully' });
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createMessage = createMessage;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.id;
    const updatedMessage = req.body;
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        yield pool.request()
            .input('author_email', updatedMessage.author_email)
            .input('chatId', updatedMessage.chatId)
            .input('message', updatedMessage.message)
            .input('id', messageId)
            .query('UPDATE Message SET author_email = @author_email, chatId = @chatId, message = @message WHERE id = @id');
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
            .query('DELETE FROM Message WHERE id = @id');
        res.status(200).json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteMessage = deleteMessage;
