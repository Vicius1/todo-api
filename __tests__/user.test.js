const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/models/prisma");
const bcrypt = require("bcryptjs");

// Teste para as rotas de usuário
describe("User Routes", () => {
    beforeEach(async () => {
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Teste para a rota de registro de usuário
    it("should create a new user successfully when given valid data", async () => {
        const userData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        const response = await request(app)
            .post("/users/register")
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe(userData.email);
        expect(response.body).not.toHaveProperty("password");
    });

    // Teste para a rota de registro de usuário com dados inválidos
    it("should return 409 if the email is already in use", async () => {
        await prisma.user.create({
            data: {
                name: "Existing User",
                email: "existing@example.com",
                password: "somepassword",
            },
        });

        const userData = {
            name: "Another User",
            email: "existing@example.com",
            password: "password123",
        };

        const response = await request(app)
            .post("/users/register")
            .send(userData);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Este e-mail já está em uso.");
    });

    // Teste para a rota de login de usuário
    it("should return a JWT token when login is successful", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        await prisma.user.create({
            data: {
                name: "Login User",
                email: "login@example.com",
                password: hashedPassword,
            },
        });

        const loginData = {
            email: "login@example.com",
            password: "password123",
        };

        const response = await request(app)
            .post("/users/login")
            .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
    });

    // Teste para a rota de login com credenciais inválidas
    it("should return 401 for invalid credentials (wrong password)", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        await prisma.user.create({
            data: {
                name: "Login User",
                email: "login@example.com",
                password: hashedPassword,
            },
        });

        const loginData = {
            email: "login@example.com",
            password: "wrongpassword",
        };

        const response = await request(app)
            .post("/users/login")
            .send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credenciais inválidas");
    });
});
