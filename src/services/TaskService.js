// TaskService é responsável por toda a lógica de negócio relacionada as tarefas.
// Ele interage com o banco de dados através do Prisma e garante que as tarefas sejam associadas ao usuário correto.
class TaskService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    // Criar uma nova tarefa
    async create(userId, taskData) {
        const { name, description, priority, dueDate } = taskData;
        return this.prisma.task.create({
        data: {
            name,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: userId, // Vincula a tarefa ao usuário logado
        },
        });
    }

    // Listar todas as tarefas de um usuário específico
    async findAll(userId, status) {
        const whereClause = {
            userId: userId, // Filtro para garantir que o usuário só veja suas tarefas
        };

        // Adiciona o filtro de status apenas se ele for fornecido
        if (status) {
            whereClause.status = status;
        }

        return this.prisma.task.findMany({
            where: whereClause,
        });
    }

    // Atualizar uma tarefa
    async update(taskId, userId, updateData) {
        // Primeiro, verifica se a tarefa existe E pertence ao usuário
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.userId !== userId) {
            throw new Error('Tarefa não encontrada ou não pertence ao usuário.');
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });
    }

    // Deletar uma tarefa
    async delete(taskId, userId) {
        // Primeiro, verifica se a tarefa existe E pertence ao usuário
        const task = await this.prisma.task.findUnique({
            
        });

        if (!task || task.userId !== userId) {
            throw new Error('Tarefa não encontrada ou não pertence ao usuário.');
        }

        await this.prisma.task.delete({
            where: { id: taskId },
        });
    }
}

module.exports = TaskService;