const express = require("express");
const todoRouter = express.Router();
const {
    allTodo,
    createTodo,
    getTodoById,
    deleteTodo,
    updateTodo,
    setTodoStatusComplete
} = require("../controller/todoController");

todoRouter.get("/", allTodo);
todoRouter.post("/", createTodo); 
todoRouter.get("/:id", getTodoById); 
todoRouter.delete("/:id", deleteTodo); 
todoRouter.put("/:id", updateTodo); 
// todoRouter.put("/:id/complete", setTodoStatusComplete); 

module.exports = todoRouter;
