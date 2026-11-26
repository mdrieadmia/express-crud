import jwt, { type JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { ILogin } from "./auth.interface.js";
import config from "../../config/index.js";

const loginUserIntoDB = async (payload : ILogin)=>{
    const {email, password} = payload;

    const user = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email])

    if(user.rowCount === 0 ){
        throw new Error("Invalid Credentials!")
    }
    
    
    if(!user.rows[0].is_active){
        throw new Error("User Blocked")
    }
    
    
    const matchedPassword = await bcrypt.compare(password, user?.rows[0]?.password)

    if(!matchedPassword){
        throw new Error("Password Wrong!")
    }

    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        is_active: user.rows[0].is_active,
        role : user.rows[0].role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {expiresIn: "1h"})
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, {expiresIn: "10d"})
    delete user.rows[0].password;
    return {
        accessToken,
        refreshToken,
        user : user.rows[0]
    };
    }
    const genarateAccessToken = async(token: string)=>{
        if(!token){
            throw new Error("Unauthorized Access!")
        }
        const decode = jwt.verify(token as string, config.jwt_refresh_secret as string) as JwtPayload;
        if(!decode){
            throw new Error("Unauthorized Access!")
        }
        const user = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `,[decode.email],
        );  
        if(user.rowCount === 0){
            throw new Error("Unauthorized Access!")
        }
        if(user.rows[0].is_active === false){
            throw new Error("Unauthorized Access!")
        }
        const jwtPayload = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
            is_active: user.rows[0].is_active,
            role : user.rows[0].role
        }
        const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {expiresIn: "1h"})
        return {accessToken};
    }

export const authService = {
    loginUserIntoDB,
    genarateAccessToken
}