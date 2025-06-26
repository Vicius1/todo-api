// TaskController é a camada responsável por receber as requisições HTTP para as rotas de tarefa.
// Ele extrai dados da requisição, chama os métodos apropriados do TaskService e envia a resposta (seja de sucesso ou de erro)
// de volta para o cliente.
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }

    // Responsável por lidar com a requisição de criação de uma nova tarefa.
    create = async (req, res) => {
        const { name, status, priority, dueDate } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ message: 'O campo "name" é obrigatório.' });
        }

        if (status && !["pendente", "concluída"].includes(status)) {
            return res.status(400).json({ message: 'Se fornecido, o status deve ser "pendente" ou "concluída".' });
        }

        if (priority && !["baixa", "media", "alta"].includes(priority)) {
            return res.status(400).json({ message: 'Se fornecida, a prioridade deve ser "baixa", "media" ou "alta".' });
        }

        if (dueDate && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ message: 'O formato de dueDate é inválido. Use o padrão ISO 8601 (Ex: "2025-12-31T23:59:59.000Z").' });
        }

        try {
            const userId = req.userId;
            const task = await this.taskService.create(userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro interno ao criar a tarefa." });
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
            res.status(500).json({ message: "Ocorreu um erro interno ao listar as tarefas." });
        }
    };

    // Responsável por lidar com a requisição de atualização de uma tarefa específica.
    update = async (req, res) => {
        const { name, status, priority, dueDate } = req.body;

        if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
            return res.status(400).json({ message: 'O campo "name" não pode ser vazio.' });
        }

        if (status && !["pendente", "concluída"].includes(status)) {
            return res.status(400).json({ message: 'O status deve ser "pendente" ou "concluída".' });
        }

        if (priority && !["baixa", "media", "alta"].includes(priority)) {
            return res.status(400).json({ message: 'Se fornecida, a prioridade deve ser "baixa", "media" ou "alta".' });
        }

        if (dueDate && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ message: 'O formato de dueDate é inválido. Use o padrão ISO 8601 (Ex: "2025-12-31T23:59:59.000Z").' });
        }

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
