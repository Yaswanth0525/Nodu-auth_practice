const mongooes=require('mongoose');
require('dotenv').config();

const connectDB = async () =>{
    try{
        await mongooes.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    }catch(err){
        console.log("MongoDB connection Failed",err);
        process.exit(1);
    }
}
module.exports=connectDB;