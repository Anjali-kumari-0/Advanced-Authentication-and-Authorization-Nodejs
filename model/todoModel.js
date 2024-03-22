const mongoose= require("mongoose");
const todoSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    status:{
        type:String,
    },
    dueTime:{
        type:Date
    }

},{timestamps:true})
todoSchema.set('toJSON', {
    transform: function (doc, ret) {
        // Convert timestamps to local time
        ret.createdAt = ret.createdAt.toLocaleString();
        ret.updatedAt = ret.updatedAt.toLocaleString();
        // Convert dueTime to local time
        if (ret.dueTime)
            ret.dueTime = ret.dueTime.toLocaleString();
        return ret;
    }
});
const todo=mongoose.model("todo",todoSchema)
module.exports=todo;
