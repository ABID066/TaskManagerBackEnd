const mongoose = require('mongoose')
const DataSchema= new mongoose.Schema({

    email:{type:String,required:true},
    otp:String,
    status:{type: Number, default: 0},
    createdAt:{ type:Date,default:Date.now},

},{versionKey:false});

const OTPModel = mongoose.model("otps",DataSchema);
module.exports = OTPModel;