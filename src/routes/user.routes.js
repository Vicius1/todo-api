const { Router } = require("express");
const prisma = require("../models/prisma");
const UserService = require("../services/UserService");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const userServiceInstance = new UserService(prisma);
const userControllerInstance = new UserController(userServiceInstance);

const router = Router();

// Rotas de usuário
// Rota de registro de usuário
router.post("/register", userControllerInstance.create);
// Rota de login de usuário
router.post("/login", userControllerInstance.login);
// Rota de ID de usuário
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        message: `Acesso permitido! Você é o usuário com ID: ${req.userId}`,
    });
});

module.exports = router;