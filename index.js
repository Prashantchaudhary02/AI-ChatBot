import 'dotenv/config';
import express from "express"
import connectDB from "./Config/database.js"
import {connectRedis} from "./Config/redis.js"
import userRouter from "./Routes/userRouter.js"
import chatRouter from "./Routes/chatRouter.js"
import messageRouter from "./Routes/messageRouter.js"
import cookieParser from "cookie-parser"


const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/user", userRouter);
app.use("/chat",chatRouter);
app.use("/msg", messageRouter);



const startServer = async ()=>{

    try{
        await connectDB();
        await connectRedis();

        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening at port ${process.env.PORT}`);
        })

    }
    catch{
        console.log(err);
    }
}

startServer();