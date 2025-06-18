const bcrypt = require('bcryptjs');

class UserService {
  // O construtor recebe as dependências da classe.
  // Isso é chamado de Injeção de Dependência.
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

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
}

// Exportamos a classe, não um objeto com funções
module.exports = UserService;