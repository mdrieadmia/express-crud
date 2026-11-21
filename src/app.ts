import { Pool } from 'pg';
import express, { type Application, type Request, type Response } from "express";
import config from './config/index.js';
import { pool } from './db/index.js';
import { userRoute } from './modules/users/user.route.js';


const app:Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/users", userRoute)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        success: true,
        message: "This is root route from server",
        author: "Riead"
    })
    res.send("This is root route")
})

export default app;