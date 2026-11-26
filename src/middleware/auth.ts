import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { Roles } from "../types/index.js";

const auth = (...roles :Roles[])=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
        try{
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({
            success: false,
            message: "Unauthorized Access!"
            })
        }

        const decode = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;

        if(!decode){
            return res.status(401).json({
            success: false,
            message: "Unauthorized Access!"
            })
        }

        const user = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `,[decode.email],
        );
        
        if(user.rowCount === 0){
            return res.status(404).json({
            success: false,
            message: "User Not Found!"
            })
        }

        if(user.rows[0].is_active === false){
            return res.status(404).json({
            success: false,
            message: "User Blocked!"
            })
        }

        if(roles.length && !roles.includes(user.rows[0].role)){
            return res.status(404).json({
            success: false,
            message: "Unauthorized Access Denied!"
            })
        }

        req.user = decode;

        next();
        }catch(err){
            next(err)
        }
    }
}
export default auth;