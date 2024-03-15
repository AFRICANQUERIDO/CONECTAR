require('dotenv').config();

import cors from 'cors'
import userRouter from './routes/authRouter'
import express, { NextFunction, Request,Response, json } from 'express'
import industryRouter from './routes/industryRouter';

const app = express()

app.use(cors())
app.use(json())

app.use('/users', userRouter)
app.use('/industry', industryRouter)

app.use((error:Error, request:Request, response:Response, next:NextFunction)=>{
    response.json({
        message:error.message
    })
})

let port = 4500

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})