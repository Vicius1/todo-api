const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// UserService é responsável por toda a lógica de negócio relacionada aos usuários.
// Ele interage com o banco de dados através do Prisma e lida com a criptografia de senhas.
class UserService {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    // Criar um novo usuário
    async create(name, email, password) {
        // 1. Verificar se o e-mail já existe, usando a instância do prisma
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("Este e-mail já está em uso.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Remover a senha do objeto antes de retorná-lo
        delete newUser.password;
        return newUser;
    }

    // Autenticar um usuário.
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        // Comparar a senha enviada com a senha criptografada no banco
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas");
        }

        // Se as credenciais estiverem corretas, geramos o token JWT
        const token = jwt.sign(
            { id: user.id }, // Payload: dados que queremos armazenar no token
            process.env.JWT_SECRET, // Chave secreta do .env
            { expiresIn: "8h" } // Opções: define o tempo de expiração do token
        );

        return { token };
    }
}

module.exports = UserService;
