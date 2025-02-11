import mongoose from "mongoose"
const MONGO_URI =process.env.mongouri

const dbconnection = async() =>{
    const {connection} = await mongoose.connect(MONGO_URI)
    try {
        
        if(connection){
            console.log(`connected to ${connection.host}`);
        }
    } catch (error) {
        process.exit(1);
        console.log(error);
    }
}

export default dbconnection;
