import mongoose from "mongoose"
const MONGO_URI = 'mongodb+srv://gurdev191004:xZ4JOIwab0NZaod6@cluster0.bwk8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

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
