import app from "./app.js";
import config from "./config/index.js";
import { initDB } from "./db/index.js";

const main = ()=>{
    app.listen(config.port, ()=>{
        console.log(`The Express Server Is Running On Port : ${config.port}`);
    })

    initDB();
}

main();