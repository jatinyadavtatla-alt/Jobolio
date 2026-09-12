const JobSchema=require('../schema/JobSchema');
const mongoose = require("mongoose");

const Job=mongoose.model('Job',JobSchema);
module.exports=Job;

