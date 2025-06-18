class UserController {
  // Recebe uma instância do nosso UserService
  constructor(userService) {
    this.userService = userService;
  }

  // Usamos uma "arrow function" como propriedade da classe
  // para garantir que o `this` sempre se refira à instância do UserController,
  // mesmo quando chamado pelo Express.
  create = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      // Usa o método create da instância do service
      const newUser = await this.userService.create(name, email, password);

      return res.status(201).json(newUser);

    } catch (error) {
      // 409 Conflict é um bom status para recursos duplicados
      return res.status(409).json({ message: error.message });
    }
  }
}

module.exports = UserController;