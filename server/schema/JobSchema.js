const mongoose=require('mongoose');

const JobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    tag:{
        type:[String],
        required:true,
    },
    Salary:{
        type:Number,
        required:true,
    },
    employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
}

})

module.exports=JobSchema;