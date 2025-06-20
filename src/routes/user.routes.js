const { Router } = require("express");
const prisma = require("../models/prisma");

const UserService = require("../services/UserService");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const userServiceInstance = new UserService(prisma);
const userControllerInstance = new UserController(userServiceInstance);

const router = Router();

// Rotas de usuários
// Rota de cadastro
router.post("/register", userControllerInstance.create);
// Rota de login
router.post("/login", userControllerInstance.login);

// O middleware é colocado entre o caminho da rota e o controller final.
router.get("/me", authMiddleware, (req, res) => {
    // Se chegamos aqui, o middleware rodou com sucesso e adicionou `req.userId`
    res.status(200).json({
        message: `Acesso permitido! Você é o usuário com ID: ${req.userId}`,
    });
});

module.exports = router;
