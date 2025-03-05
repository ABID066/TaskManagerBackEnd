const UserModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utilites/SendEmailUtility");


//registration
exports.registration = async (req, res) => {
    try {
        let reqBody = req.body;
        await UserModel.create(reqBody);
        res.status(200).json({status: "success", message: "User Registration Complete"});
    } catch (err) {
        res.status(200).json({status: "fail", message: err});
    }

}


//login
exports.login = async (req, res) => {
    try {
        let reqBody = req.body;

        let data = await UserModel.aggregate([
            { $match: reqBody },
            { $project: { _id: 0, email: 1, firstName: 1, lastName: 1, mobile: 1 ,photo: 1} }
        ]);

        // Check if user exists
        if (data.length === 0) {
            return res.status(401).json({ status: "unauthorized" });
        }

        // Generate JWT token
        let payload = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1-day expiration
            data: data[0]["email"]
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET);

        // Send response
        res.status(200).json({status: "success", token: token, data: data[0]});

    } catch (err) {
        res.status(500).json({ status: "fail", message: err.message || "Internal Server Error" });
    }
};


//Update
exports.profileUpdate=async (req,res)=>{
    try {
        let email= req.headers["email"]
        await UserModel.updateOne({email: email},req.body);
        res.json({status:"success",message:"Profile updated"});
    } catch(err) {
        res.json({status:"fail",message:err.toString()});
    }
}

//Get Profile Details
exports.profileDetails = async (req,res)=>{
    let email= req.headers["email"];

    try {
        let result= await UserModel.aggregate([
            {$match:{email: email}},
            {$project: { _id: 1, email:1, firstName: 1, lastName: 1, mobile: 1, photo: 1, password: 1 }}
        ])
        res.status(200).json({status:"success",result:result});
    } catch (err) {
        res.status(400).json({status:"fail",message:err.toString()});
    }
}

//Recover Password 01: Send OTP
exports.VerifyUserEmail = async (req, res) => {
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000);

    try {
        let UserCount = await UserModel.aggregate([
            { $match: { email: email } },
            { $count: "total" }
        ]);

        if (UserCount.length > 0 && UserCount[0].total > 0) {
            await OTPModel.create({ email: email, otp: OTPCode });
            let SendEmail = await SendEmailUtility(email, OTPCode);

            res.status(200).json({ status: "success", result: SendEmail });
        } else {
            res.status(200).json({ status: "fail", message: "No User Found" });
        }
    } catch (e) {
        res.status(400).json({ status: "fail", message: e.toString() });
    }
};

//Recover Password 02: Verify OTP
exports.VerifyOTP = async (req, res) => {
    let email = req.params.email;
    let OTPCode =req.params.otp;
    try {
        let otpCount = await OTPModel.aggregate([
            {$match: {email: email, otp: OTPCode, status: 0}},
            {$count: "total"}
        ])
        if (otpCount.length > 0 && otpCount[0].total > 0) {
            let otpStatus = await OTPModel.updateOne(
                {email: email, otp: OTPCode, status: 0},
                {status: 1}
            )
            res.status(200).json({ status: "success", message: otpStatus });
        } else {
            res.status(200).json({ status: "fail", message: "Invalid OTP Code" });
        }
    } catch (e) {
        res.status(400).json({ status: "fail", message: e.toString() });
    }
}

//Recover Password 03: Verify OTP
exports.ResetPassword = async (req, res) => {
    try {
        let email = req.body["email"];
        let OTPCode = req.body["OTP"];
        let NewPass = req.body["password"];
        let otpUsedCount = await OTPModel.aggregate([
            { $match: { email: email, otp: OTPCode, status: 1 } },
            { $count: "total" }
        ]);

        if (otpUsedCount.length > 0  && otpUsedCount[0].total > 0) {
            await OTPModel.deleteOne({email: email});
            await UserModel.updateOne(
                {email: email},
                {password: NewPass}
            );

            res.json({status: "success", message: "Password changed successfully"});
        }else {

            res.status(200).json({ status: "fail", message: "Didn't work" });
        }
    } catch (err) {
        res.json({ status: "fail", message: err.toString() });
    }

}
