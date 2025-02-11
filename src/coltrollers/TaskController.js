const TaskModel = require('../models/TaskModel');

//create-task
exports.createTask = async (req, res) => {
    try {
        let reqBody = req.body;
        reqBody.email = req.headers.email;
        await TaskModel.create(reqBody);
        res.status(200).json({status: "success", message: "Product created"});
    } catch (err) {
        res.status(400).json({status: "fail", message: err.toString()});
    }

}
//read by status
exports.readByStatus=async (req,res)=>{
    try {
        let email= req.headers["email"]
        let status = req.params.status
        let data = await TaskModel.aggregate( [
            {$match:{ status: status, email: email}},
            {$project: { _id: 0, title: 1, description: 1, status:1,
                    createDate: {$dateToString: {date:"$createdAt", format:"%d-%m-%Y"}} }}
        ]);
        res.status(200).json({status:"success",message:data});
    }catch(err){
        res.status(400).json({status:"fail",message:err.toString()});
    }
}/*
exports.readByStatus = async (req, res) => {
    try {
        let { status } = req.params;

        // Fetch all products with the given status
        let data = await TaskModel.find({ status: status });

        res.status(200).json({ status: "success", data: data });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.toString() });
    }
};*/


//update status
/*exports.updateStatus=async (req,res)=>{
    try {
        let { id } = req.params;
        let {status} = req.params.status;

        await TaskModel.updateOne({_id:id},{ $set: { status: status } });
        res.json({status:"success",message:"Status updated"});
    }catch(err){
        res.json({status:"fail",message:err.toString()});
    }
}*/
exports.updateTaskStatus = async (req, res) => {
    try {
        let { id, status } = req.params;
        let query = { _id: id };
        let reqBody = { status: status };

        let updatedTask = await TaskModel.updateOne(query, reqBody);

        res.status(200).json({ status: "success", data: updatedTask });
    } catch (err) {
        res.status(400).json({ status: "fail", data: err.toString() });
    }
};


//delete
exports.deleteTask=async (req,res)=>{
    try {
        let { id } = req.params;
        await TaskModel.deleteOne({_id:id});
        res.status(200).json({status:"success",message:"Product deleted"});
    }catch(err){
        res.status(400).json({status:"fail",message:err.toString()});
    }
}


//
exports.tasksCount = async (req,res)=>{
    try {
        let email= req.headers["email"]
        let result = await TaskModel.aggregate([
            {$match:{email: email}},
            {$group: { _id: "$status", sum: { $count: {}}}}
        ])
        res.status(200).json({status:"success",result:result});


    } catch (e) {
        res.status(400).json({status:"fail",message:err.toString()});

    }
}


