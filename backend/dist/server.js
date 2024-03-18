"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const express_1 = __importStar(require("express"));
const industryRouter_1 = __importDefault(require("./routes/industryRouter"));
const app = (0, express_1.default)();
// Websockets section starts here
// const server = http.createServer(express)
// const wss = new WebSocket.Server({server})
// wss.on('connection', function connection(ws){
//     // const userId = 
//     ws.on('message', function incoming(data, isBinary){
//         wss.clients.forEach(async function each(client){
//             if(client !== ws && client.readyState === WebSocket.OPEN){
//                 console.log(data);
//                 client.send(data, {binary: isBinary})
//             }
//         })
//     })
// })
// server.listen(4101, ()=>{
//     console.log('websocket server running on port 4101'); 
// })
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use('/users', authRouter_1.default);
app.use('/industry', industryRouter_1.default);
app.use((error, request, response, next) => {
    response.json({
        message: error.message
    });
});
let port = 4500;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
