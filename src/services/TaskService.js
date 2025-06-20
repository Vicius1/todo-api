// TaskService é responsável por toda a lógica de negócio relacionada as tarefas.
// Ele interage com o banco de dados através do Prisma.
class TaskService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    // Criar uma nova tarefa
    async create(userId, taskData) {
        const data = {
            name: taskData.name,
            userId: userId,
        };

        if (taskData.description) {
            data.description = taskData.description;
        }
        if (taskData.priority) {
            data.priority = taskData.priority;
        }
        if (taskData.dueDate) {
            data.dueDate = new Date(taskData.dueDate);
        }

        try {
            const newTask = await this.prisma.task.create({
                data: data,
            });
            return newTask;
        } catch (error) {
            throw error;
        }
    }

    // Listar todas as tarefas de um usuário, com opção de filtrar por status
    async findAll(userId, status) {
        const whereClause = { userId: userId };
        if (status) {
            whereClause.status = status;
        }
        return this.prisma.task.findMany({ where: whereClause });
    }

    // Atualizar uma tarefa específica
    async update(taskId, userId, updateData) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.userId !== userId) {
            throw new Error(
                "Tarefa não encontrada ou não pertence ao usuário."
            );
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });
    }

    // Deletar uma tarefa específica
    async delete(taskId, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.userId !== userId) {
            throw new Error(
                "Tarefa não encontrada ou não pertence ao usuário."
            );
        }

        await this.prisma.task.delete({
            where: { id: taskId },
        });
    }
}

module.exports = TaskService;
