// TaskController é a camada responsável por receber as requisições HTTP para as rotas de tarefa.
// Ele extrai dados da requisição, chama os métodos apropriados do TaskService e envia a resposta (seja de sucesso ou de erro)
// de volta para o cliente.
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }

    // Responsável por lidar com a requisição de criação de uma nova tarefa.
    create = async (req, res) => {
        try {
            const userId = req.userId;
            const task = await this.taskService.create(userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Responsável por lidar com a requisição de listagem de todas as tarefas do usuário.
    findAll = async (req, res) => {
        try {
            const userId = req.userId;
            const { status } = req.query;
            const tasks = await this.taskService.findAll(userId, status);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Responsável por lidar com a requisição de atualização de uma tarefa específica.
    update = async (req, res) => {
        try {
            const userId = req.userId;
            const taskId = parseInt(req.params.id);
            const task = await this.taskService.update(
                taskId,
                userId,
                req.body
            );
            res.status(200).json(task);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    // Responsável por lidar com a requisição de deleção de uma tarefa específica.
    delete = async (req, res) => {
        try {
            const userId = req.userId;
            const taskId = parseInt(req.params.id);
            await this.taskService.delete(taskId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };
}

module.exports = TaskController;
