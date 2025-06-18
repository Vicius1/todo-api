const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// UserService é responsável por toda a lógica de negócio relacionada aos usuários.
// Ele interage com o banco de dados através do Prisma e lida com a criptografia de senhas.
class UserService {
    // O construtor recebe as dependências da classe.
    // Isso é chamado de Injeção de Dependência.
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }

    // O método create é responsável por criar um novo usuário.
    async create(name, email, password) {
        // 1. Verificar se o e-mail já existe, usando a instância do prisma
        const existingUser = await this.prisma.user.findUnique({
        where: { email },
        });

        if (existingUser) {
        throw new Error('Este e-mail já está em uso.');
        }

        // 2. Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Criar o usuário no banco de dados
        const newUser = await this.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        });

        // 4. Remover a senha do objeto antes de retorná-lo
        delete newUser.password;
        return newUser;
    }

    // O método login é responsável por autenticar um usuário.
    async login(email, password) {
        // Encontrar o usuário pelo e-mail
        const user = await this.prisma.user.findUnique({
        where: { email },
        });

        // Se o usuário não for encontrado, lançamos um erro.
        if (!user) {
        throw new Error('Credenciais inválidas');
        }

        // Comparar a senha enviada com a senha criptografada no banco
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Se a senha for inválida, lançamos o mesmo erro genérico.
        if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
        }

        // Se as credenciais estiverem corretas, geramos o token JWT
        const token = jwt.sign(
        { id: user.id },            // Payload: dados que queremos armazenar no token
        process.env.JWT_SECRET,     // Chave secreta do .env
        { expiresIn: '8h' }        // Opções: define o tempo de expiração do token
        );

        // Retornamos o token
        return { token };
    }

}

module.exports = UserService;