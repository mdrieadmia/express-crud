import type { NextFunction, Request, Response } from "express";
import fs from 'fs';

const logger = async(req:Request, res:Response, next:NextFunction) =>{
    const loggerInfo = `Method: ${req.method} | URL: ${req.url} | Time: ${Date.now()} \n`

    fs.appendFile("Logger.txt", loggerInfo, (err)=>{
        return err;
    })
    next()
}

export default logger;