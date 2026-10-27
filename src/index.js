import app from "./app.js";
import dotenv from "dotenv";
import {createServer} from "node:http"
import connectDb from "./db/index.js"
import { initializwSocketServer } from "./services/socket.service.js";
const httpServer = createServer(app)

initializwSocketServer(httpServer)
dotenv.config()


connectDb()
.then(()=>{
httpServer.listen(3000,()=>{
    console.log("app is listenting on port 3000")
})
}
)
.catch((err)=>{
    console.log("db connection error",err)
})
