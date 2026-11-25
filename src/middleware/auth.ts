import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config/index.js";
import { pool } from "../db/index.js";

const auth = async (req:Request, res:Response, next:NextFunction)=>{
    try{
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({
        success: false,
        message: "Unauthorized Access!"
        })
    }

    const decode = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;

    if(!decode){
        res.status(401).json({
        success: false,
        message: "Unauthorized Access!"
        })
    }

    const user = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `,[decode.email],
    );
    
    if(user.rowCount === 0){
        res.status(404).json({
        success: false,
        message: "User Not Found!"
        })
    }

    if(user.rows[0].is_active === false){
        res.status(404).json({
        success: false,
        message: "User Blocked!"
        })
    }

    req.user = decode;

    next();
    }catch(err){
        res.status(401).json({
        success: false,
        message: "Unauthorised Don't Have Access"
        })
    }
}

export default auth;