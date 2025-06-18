const { Router } = require('express');
const prisma = require('../models/prisma');
const TaskService = require('../services/TaskService');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/authMiddleware');

const taskServiceInstance = new TaskService(prisma);
const taskControllerInstance = new TaskController(taskServiceInstance);

const router = Router();

// Middleware de autenticação em todas as rotas de tarefas
router.use(authMiddleware);

// Rotas de tarefas
// Rota de criação de tarefa
router.post('/', taskControllerInstance.create);
// Rota para listar todas as tarefas (com filtro opcional de status)
router.get('/', taskControllerInstance.findAll);
// Rota para atualizar uma tarefa específica
router.put('/:id', taskControllerInstance.update);
// Rota para deletar uma tarefa específica
router.delete('/:id', taskControllerInstance.delete);

module.exports = router;