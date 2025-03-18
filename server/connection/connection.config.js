import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function server_connection(ExpressInstance,PORT){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to DB");
    }).then(()=>{
        console.log("Connecting to server please wait a second"); 
    }).then(()=>{
        ExpressInstance.listen(PORT, () => {  // ✅ Correct
            console.log(`Server is Running on port: ${PORT}`);
        });
    }).catch((err)=>{
        console.log(err);
        console.log(err.message);
        console.log("Oops sorry could not connect to server");
    })
};


export default server_connection;