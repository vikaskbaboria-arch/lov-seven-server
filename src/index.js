import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/index.js"
dotenv.config()


connectDb()
.then(
app.listen(3000,()=>{
    console.log("app is listenting on port 3000")
})
)
