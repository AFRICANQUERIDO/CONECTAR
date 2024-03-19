import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User } from "../intefaces/userInterface"

export interface ExtendeUser extends Request {

    info?: User
}

export const verifyToken = (req: ExtendeUser, res: Response, next: NextFunction) => {
    try {

        const token = req.headers['token'] as string
        // token in different parts
        // const token1 = req.body.token1 || req.query.token1 || req.headers['token']

        // check for provided token
        if (!token) {
            return res.json({
                message: "An authentication token is required"
            })
        }
         // Verify token
         const userdata = jwt.verify(token, process.env.SECRET as string) as User;
         req.info = userdata;
         console.log(userdata);
     } catch (error) {
         return res.json({
             error: "Invalid token provided"
         });
     }

    next();
}