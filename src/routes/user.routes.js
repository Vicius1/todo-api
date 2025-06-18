const { Router } = require('express');
const prisma = require('../models/prisma');

const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

// --- Ponto de Injeção de Dependências ---
const userServiceInstance = new UserService(prisma);
const userControllerInstance = new UserController(userServiceInstance);

const router = Router();
// Rota de cadastro
router.post('/register', userControllerInstance.create);
// Rota de login
router.post('/login', userControllerInstance.login);

module.exports = router;