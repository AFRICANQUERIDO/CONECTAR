import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../intefaces/userInterface";


export interface ExtendedUser extends Request {
    userInfo?: User;
}

export const verifyAdminToken = (req: ExtendedUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['token'] as string;
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }

        const userData = jwt.verify(token, process.env.SECRET as string) as User;
        req.userInfo = userData;

        // Check if the user's role is admin
        if (userData.role !== 'Admin') {
            return res.status(403).json({ error: "Access denied. You do not have admin privileges" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};


export const verifyCustomerToken = (req: ExtendedUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['token'] as string;
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }

        const userData = jwt.verify(token, process.env.SECRET as string) as User;
        req.userInfo = userData;

        // Check if the user's role is customer
        if (userData.role !== 'customer') {
            return res.status(403).json({ error: "Access denied. You do not have customer privileges" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};


export const verifySpecialistToken = (req: ExtendedUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['token'] as string;
        if (!token) {
            return res.status(401).json({ error: "An authentication token is required" });
        }

        const userData = jwt.verify(token, process.env.SECRET as string) as User;
        req.userInfo = userData;

        // Check if the user's role is specialist
        if (userData.role !== 'specialist') {
            return res.status(403).json({ error: "Access denied. You do not have specialist privileges" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token provided" });
    }
};
