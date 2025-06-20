require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API To-do rodando!" });
});

// Configuração das rotas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
