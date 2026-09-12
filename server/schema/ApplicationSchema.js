const mongoose=require('mongoose');

const ApplicationSchema=new mongoose.Schema({
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required:true,

    },
    candidate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    resumeUrl:{
        type:String,
        required :true,
    },
    status:{
        type: String,
        enum: ["applied","shortlisted","rejected","hired"],
        default: "applied",

    },
    appliedAt:{
        type:Date,
       default:Date.now,
    }
})

module.exports=ApplicationSchema;