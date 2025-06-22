require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");

const { swaggerUi, swaggerSpec } = require("./docs/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({ message: "API To-do rodando!" });
});

// Configuração das rotas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
