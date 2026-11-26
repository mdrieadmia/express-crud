import express, { type Application, type Request, type Response } from "express";
import { userRoute } from './modules/users/user.route.js';
import { profileRoute } from './modules/profile/profile.route.js';
import { authRoute } from "./modules/auth/auth.route.js";
import fs from "fs";
import logger from "./middleware/logger.js";
import auth from './middleware/auth.js';
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import cors from 'cors';
import cookieParser from "cookie-parser";


const app:Application = express();
const corsOptions = {
      origin: ['http://localhost:5000'],
      credentials: true
    };

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))

app.use(logger);

app.use("/api/v1/users", userRoute)
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/auth", authRoute)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        success: true,
        message: "This is root route from server",
        author: "Riead"
    })
    res.send("This is root route")
})

app.use(globalErrorHandler)

export default app;