const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/models/prisma");
const bcrypt = require("bcryptjs");

// Testes para as rotas de tarefas
describe("Task Routes", () => {
    let token;
    let user;
    let otherUser;

    // beforeEach: Roda antes de CADA teste 'it'.
    // Garante um ambiente 100% limpo e isolado sempre.
    beforeEach(async () => {
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});

        const hashedPassword = await bcrypt.hash("password123", 10);

        user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                password: hashedPassword,
            },
        });

        otherUser = await prisma.user.create({
            data: {
                name: "Other User",
                email: "other@example.com",
                password: hashedPassword,
            },
        });

        const loginResponse = await request(app).post("/users/login").send({
            email: "test@example.com",
            password: "password123",
        });
        token = loginResponse.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Teste para a rota de criação de tarefa
    it("should create a new task for the authenticated user", async () => {
        const taskData = { name: "Minha primeira tarefa" };
        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send(taskData);

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(user.id);
    });

    // Teste para a rota de criação de tarefa sem token
    it("should NOT create a task if no token is provided", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ name: "Tarefa sem token" });
        expect(response.status).toBe(401);
    });

    // Teste para a rota de listagem de tarefas
    it("should list all tasks for the authenticated user", async () => {
        await prisma.task.create({
            data: { name: "Tarefa 1 do User", userId: user.id },
        });
        const response = await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    // Teste para a rota de atuaçlização de tarefa
    it("should update a task belonging to the authenticated user", async () => {
        const task = await prisma.task.create({
            data: { name: "Tarefa para atualizar", userId: user.id },
        });
        const updateData = { status: "concluída" };
        const response = await request(app)
            .put(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updateData);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("concluída");
    });

    // Teste para a rota de atualização de tarefa de outro usuário
    it("should NOT update a task belonging to another user", async () => {
        const otherTask = await prisma.task.create({
            data: { name: "Tarefa do outro", userId: otherUser.id },
        });
        const response = await request(app)
            .put(`/tasks/${otherTask.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Hacking" });
        expect(response.status).toBe(404);
    });

    // Teste para a rota de deleção de tarefa
    it("should delete a task belonging to the authenticated user", async () => {
        const task = await prisma.task.create({
            data: { name: "Tarefa para deletar", userId: user.id },
        });
        const response = await request(app)
            .delete(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});
