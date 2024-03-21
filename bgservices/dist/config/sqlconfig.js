"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlConfig1 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log(process.env.DB_NAME);
exports.sqlConfig1 = {
    user: (_a = process.env) === null || _a === void 0 ? void 0 : _a['DB_USER'],
    password: (_b = process.env) === null || _b === void 0 ? void 0 : _b['DB_PWD'],
    database: (_c = process.env) === null || _c === void 0 ? void 0 : _c['DB_NAME'],
    server: (_d = process.env) === null || _d === void 0 ? void 0 : _d['SERVER'],
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
console.log(exports.sqlConfig1);
