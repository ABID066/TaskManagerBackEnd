const mongoose = require('mongoose')
const DataSchema= new mongoose.Schema({
    title:String,
    description:String,
    status:String,
    email:{type:String,required:true},
    createdAt:{ type:Date,default:Date.now},

},{versionKey:false});

const TaskModel = mongoose.model("tasks",DataSchema);
module.exports = TaskModel;