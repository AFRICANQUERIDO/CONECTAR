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
const mssql_1 = __importDefault(require("mssql"));
const sqlconfig_1 = require("../config/sqlconfig");
class Connection {
    getUserByEmail(email) {
        throw new Error("Method not implemented.");
    }
    constructor() {
        this.pool = this.getConnection();
    }
    getConnection() {
        const pool = mssql_1.default.connect(sqlconfig_1.sqlConfig1);
        return pool;
    }
    createRequest(request, data) {
        const keys = Object.keys(data);
        keys.map((keyName) => {
            const keyValue = data[keyName];
            request.input(keyName, keyValue);
        });
        return request;
    }
    execute(procedureName_1) {
        return __awaiter(this, arguments, void 0, function* (procedureName, data = {}) {
            let pool = yield this.pool;
            let request = (yield pool.request());
            request = this.createRequest(request, data);
            const result = yield request.execute(procedureName);
            return result;
        });
    }
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.pool).request().query(query);
            return result;
        });
    }
}
exports.default = Connection;
