"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySpecialistToken = exports.verifyCustomerToken = exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdminToken = (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }
        const userData = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.userInfo = userData;
        // Check if the user's role is admin
        if (userData.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. You do not have admin privileges" });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};
exports.verifyAdminToken = verifyAdminToken;
const verifyCustomerToken = (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }
        const userData = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.userInfo = userData;
        // Check if the user's role is customer
        if (userData.role !== 'customer') {
            return res.status(403).json({ error: "Access denied. You do not have customer privileges" });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};
exports.verifyCustomerToken = verifyCustomerToken;
const verifySpecialistToken = (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }
        const userData = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.userInfo = userData;
        // Check if the user's role is specialist
        if (userData.role !== 'specialist') {
            return res.status(403).json({ error: "Access denied. You do not have specialist privileges" });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};
exports.verifySpecialistToken = verifySpecialistToken;
