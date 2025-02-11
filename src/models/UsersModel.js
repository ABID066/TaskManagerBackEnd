const mongoose = require('mongoose')
const DataSchema= new mongoose.Schema({
    email:{ type:String,unique:true,required:true },
    firstName:{ type:String,required:true},
    lastName:{ type:String,required:true},
    password:{ type:String,required:true},
    mobile:{ type:String,required:true},
    photo:{ type:String},
    createdAt:{ type:Date,default:Date.now},

},{versionKey:false});

const UserModel = mongoose.model("users",DataSchema);
module.exports = UserModel;