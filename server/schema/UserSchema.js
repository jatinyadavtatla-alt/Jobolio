const mongose = require("mongoose");

const UserSchema=new mongose.Schema( {
    name:{
        type:'string',
        required:true,
    },
    email:{
        type:'string',
        required:true,
        unique:true,
    },
    password:{
        type:'string',
        required:true,
    },
    role:{
        type: String,
        enum: ["employer", "candidate"],
        required: true,
    }

})

module.exports=UserSchema;