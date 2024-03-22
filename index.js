const express = require("express");
const connection = require("./connection");
const useRouter = require("./useRouter");
const todoRouter = require("./Router/todoRouter");

const userUrl = "mongodb://localhost:27017/userDatabase"; // Use the same database for authentication and todos
const port = 8000;

async function startServer() {
    try {
        await connection(userUrl); // Connect to the database

        const app = express();
        app.use(express.json({ extended: true }));
        app.use("/api/users", useRouter); // Routes for user authentication
        app.listen(port, () => console.log("User server connected"));
    } catch (error) {
        console.error("Error starting user server:", error);
    }
}

async function startTodoServer() {
    try {
        await connection(userUrl); // Connect to the same database

        const app = express();
        app.use(express.json({ extended: true }));
        app.use("/api/todos", todoRouter); // Routes for todos
        app.listen(8001, () => console.log("Todo server connected")); // Use a different port
    } catch (error) {
        console.error("Error starting todo server:", error);
    }
}

// Start the servers
startServer();
startTodoServer();
