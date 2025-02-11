
const express = require('express');
const router = require("./src/routes/api")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" })

//Security Middleware
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss =require("xss-clean")
const cors = require("cors");


app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());


const limiter = rateLimit({
    windowMs: 60*15*1000,
    max: 100
})
app.use(limiter);

app.use(bodyParser.json())

//Database connection

//let URL= process.env.URL;
let URL ="mongodb+srv://abidAdmin:1234@cluster0.z72chbc.mongodb.net/TaskManager"
let OPTION = {user:"", autoIndex: true}
mongoose.connect(URL, OPTION).then((res)=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err)
})

app.use("/api/v1",router)

//Undefined Route
app.use("*",(req, res)  =>{
    res.status(404).json({msg:"Wrong URL"})
})


module.exports = app;