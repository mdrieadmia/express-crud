import express, { type Application, type Request, type Response } from "express";

const app:Application = express();
const port = 5000;

app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        success: true,
        message: "This is root route from server",
        author: "Riead"
    })
    res.send("This is root route")
})

app.listen(port, ()=>{
    console.log(`The Express Server Is Running On Port : ${port}`)
})