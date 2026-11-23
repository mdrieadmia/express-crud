import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { ILogin } from "./auth.interface.js";

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

    }

    const accessToken = jwt.sign(jwtPayload, "laskdjflaskdjf", {expiresIn: "1d"})

    delete user.rows[0].password;

    return {
        accessToken,
        user : user.rows[0]
    };
    }

export const authService = {
    loginUserIntoDB,
}