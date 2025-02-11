import app from "./app.js";
import dbconnection from "./config/db.connection.js";
import cloudinary from 'cloudinary'
import Razorpay from "razorpay";
import {config} from 'dotenv'

config()
const PORT = process.env.port || 5030;

app.listen(PORT,async ()=>{
    await dbconnection()
    console.log(`server listening at http://localhost:${PORT}`);
})

cloudinary.v2.config({
    cloud_name: process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

const razorpay = new Razorpay({
    key_id: process.env.razorpaykey_id,
    key_secret: process.env.razorpaykey_secret  
});