import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mssql from 'mssql'
import jwt from 'jsonwebtoken'
import { ExtendeUser } from "../middlewares/verifyToken";
import Connection from "../dbHelper/dbhelper";
import { sqlConfig } from "../config/sqlConfig";

export const createSpecialist = async {}