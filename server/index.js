import express from "express";
import dotenv from "dotenv";
import server_connection from "./connection/connection.config.js";
import quizRoute from "./routes/quiz.routes.js";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(authRoute);
app.use(quizRoute);

app.get("/",(req,res)=>{
    res.send("Hello World");
});

// server_connection(app,port);  
// app.listen(3000,()=>{
//     console.log(`Server is running on port ${port}`);
// });


mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(3000,()=>{
        console.log(`Server is running on port 3000`);
    })
})