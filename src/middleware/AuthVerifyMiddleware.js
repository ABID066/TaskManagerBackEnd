const jwt = require("jsonwebtoken");

exports.AuthVerify=(req,res,next)=>{
    let token = req.headers["token"];

    jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
        if(err){
            res.status(401).json({status:"Invalid Token",message:err.toString()});
        }
        else {
            let email=decoded["data"];
            req.headers.email=email;
            next();
        }
    })
}