const ApplicationSchema=require('../schema/ApplicationSchema');
const mongoose=require('mongoose');

const Application=mongoose.model('Application',ApplicationSchema);

module.exports=Application;