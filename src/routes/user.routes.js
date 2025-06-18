const { Router } = require('express');
const prisma = require('../models/prisma');

const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

// --- Ponto de Injeção de Dependência ---
// 1. Criamos uma instância do Service, passando o prisma como dependência
const userServiceInstance = new UserService(prisma);

// 2. Criamos uma instância do Controller, passando o service como dependência
const userControllerInstance = new UserController(userServiceInstance);

const router = Router();
// A rota agora chama o método da *instância* do controller
router.post('/register', userControllerInstance.create);

module.exports = router;