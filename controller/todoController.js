const todo = require("../model/todoModel")

async function allTodo(req, res, next) {
    const todos = await todo.find();
    return res.status(400).json({ msg: "fetched", data: todos })
}
async function createTodo(req, res, next) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ msg: "body is required" })
    } else if (!body.title) {
        return res.status(400).json({ msg: "title is required" })

    }
    else if (!body.description) {
        return res.status(400).json({ msg: "description is required" })
    } try {
        const newTodo = await todo.create({
            ...body
        })
        return res.status(201).json({ msg: "created", data: newTodo })
    } catch (err) {
        return res.status(500).json({ msg: "somthing worng", data: err })
    }


}
async function getTodoById(req, res, next) {
    const id = req.param.id;
    try {
        const todoItem = await todo.findById(id);

        if (!todoItem) {
            return res.status(401).json({ msg: "todo not found please check your id!" })
        }
        return res.status(200).json({ msg: "success", data: todoItem })

    } catch (err) {
        return res.status(500).json({ msg: "somthing went wrong ", data: err })
    }

}
async function deleteTodo(req, res, next) {
    const id = req.params.id;
    try {
        const todoId = await todo.findByIdAndDelete(id)
        if (!todoId) {
            return res.status(404).json({ msg: "todo not found" })
        }
        return res.status(200).json({ msg: "deletd" })


    } catch (err) {
        return res.status(500).json({ msg: "sonthing went wrong", data: err })
    }

}
async function updateTodo(req, res, next){
    const id= req.params.id;
    const updateData= req.body;
    try{
        const update= await todo.findByIdAndUpdate(id, updateData, {new:true});
        if(!update){
            res.status(404).json({msg:"todo not found"})
        }
        return res.status(200).json({msg:"updated sucessfully", data:update})

    }catch(err){
        return res.status(500).json({msg:"somthing went wrong", data:err})
    }
}
async function searchByTitle(req, res, next){ 

}
async function checkDueTodosAndNotify() {
    const now = new Date();
    const todos = await todo.find({ dueTime: { $lt: now } }); // Find todos due before current time
    todos.forEach(todo => {
        // Notify user about due todo
        sendNotification(`${todo.title} is due now!`);
    });
}

// Function to send desktop notifications
function sendNotification(message) {
    const notifier = require('node-notifier');
    notifier.notify({
        title: 'Todo Notification',
        message: message,
        sound: true, // Enable notification sound
        wait: true   // Wait with callback until user action is taken on the notification
    });
}

// Set up periodic check for due todos
setInterval(checkDueTodosAndNotify, 60000); // Check every minute
module.exports = {
    allTodo, // find()
    createTodo, //req.body        =>        .create({})
    getTodoById, //res.params.id   =>       .findById
    deleteTodo, //                 =>       .findByIdAndDelete()
    updateTodo, //                 =>        .findByIdAndUpdate()
    // setTodoStatusComplete
    searchByTitle,
    
}
