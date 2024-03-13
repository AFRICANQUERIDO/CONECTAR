"use strict";
// import dotenv from 'dotenv'
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlConfig1 = void 0;
// dotenv.config()
// console.log(process.env.DB_NAME);
exports.sqlConfig1 = {
    user: "sa",
    password: "sql.jane",
    database: "Conectar",
    server: "DESKTOP-G3PNO3V",
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
