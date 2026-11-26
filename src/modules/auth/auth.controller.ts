import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../../config/index.js";
import { pool } from "../../db/index.js";
import sendResponse from "../../utils/sendResponse.js";

const loginUser = async (req : Request, res : Response)=>{
    try{
    const result = await authService.loginUserIntoDB(req.body);
    const {refreshToken} = result;
    res.cookie("refreshToken", refreshToken,{
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        domain: "localhost"
    });

    res.status(200).json({
        success: true,
        message: "User Loggedin Successfully",
        data: {
            token : result
        }
    })
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        })
    }
}

const genarateToken = async (req : Request, res : Response)=>{
    try{
    const token = req.cookies.refreshToken;
    const result = await authService.genarateAccessToken(token);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Access Token Genarated",
        data:result
    })
    }catch(error:any){
        sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error?.message,
        error: error
        })
    }
}

export const authController = {
    loginUser,
    genarateToken
}