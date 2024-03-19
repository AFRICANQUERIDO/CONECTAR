"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['token'];
        // token in different parts
        // const token1 = req.body.token1 || req.query.token1 || req.headers['token']
        // check for provided token
        if (!token) {
            return res.json({
                message: "An authentication token is required"
            });
        }
        // Verify token
        const userdata = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.info = userdata;
        console.log(userdata);
    }
    catch (error) {
        return res.json({
            error: "Invalid token provided"
        });
    }
    next();
};
exports.verifyToken = verifyToken;
