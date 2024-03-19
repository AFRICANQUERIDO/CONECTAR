require('dotenv').config();

import cors from 'cors'
import express, { NextFunction, Request,Response, json } from 'express'
import userRouter from './routes/authRouter'
import industryRouter from './routes/industryRouter';
import sectorRouter from './routes/sectorRouter';
import gigRouter from './routes/gigRouter';
// import http from 'http'
// import WebSocket from 'ws'

const app = express()


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


app.use(cors())
app.use(json())

app.use('/users', userRouter)
app.use('/industry', industryRouter)
app.use('/sector', sectorRouter)
app.use('/gigs', gigRouter)

app.use((error:Error, request:Request, response:Response, next:NextFunction)=>{
    response.json({
        message:error.message
    })
})

let port = 4500

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})