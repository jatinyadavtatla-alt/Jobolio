const mongose=require('mongoose');
const express=require('express');

mongose.connect(process.env.MONGO_URI);

const connectDB =async()=>{
    try{
        await mongose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected succesfully");
    }
    catch(error){
        console.log("MongoDB connection failed:", error.message);
        process.exit(1);
    }

}

module.exports=connectDB;