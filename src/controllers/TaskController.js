// TaskController é a camada responsável por receber as requisições HTTP para as rotas de tarefas.
// Ele extrai dados da requisição, chama os métodos apropriados do TaskService e envia a resposta (seja de sucesso ou de erro)
// de volta para o cliente.
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }

    // Responsável por lidar com a requisição de criação de uma nova tarefa.
    create = async (req, res) => {
        try {
            // O ID do usuário vem do middleware de autenticação
            const userId = req.userId;
            const task = await this.taskService.create(userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Responsável por listar todas as tarefas do usuário logado.
    findAll = async (req, res) => {
        try {
            const userId = req.userId;
            const { status } = req.query; // Pega o status do filtro ?status=concluida
            const tasks = await this.taskService.findAll(userId, status);
            res.status(200).json(tasks);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Responsável por atualizar uma tarefa existente do usuário.
    update = async (req, res) => {
        try {
            const userId = req.userId;
            const taskId = parseInt(req.params.id);
            const task = await this.taskService.update(taskId, userId, req.body);
            res.status(200).json(task);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    // Responsável por deletar uma tarefa existente do usuário.
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