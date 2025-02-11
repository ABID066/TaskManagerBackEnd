const express = require('express');
const UserController = require("../coltrollers/UserController");
const {AuthVerify} = require("../middleware/AuthVerifyMiddleware");

const TaskController = require("../coltrollers/TaskController");



const router = express.Router();


//user
router.post("/registration",UserController.registration);
router.post("/login",UserController.login);
router.post("/profile-update",AuthVerify,UserController.profileUpdate);

//task
router.post("/create-task",AuthVerify,TaskController.createTask);
router.get("/update-task-status/:id/:status",AuthVerify,TaskController.updateTaskStatus);
router.get("/delete-task/:id",AuthVerify,TaskController.deleteTask);
router.get("/show-tasks/:status",AuthVerify,TaskController.readByStatus);
router.get("/tasks-summary",AuthVerify,TaskController.tasksCount);


module.exports = router;