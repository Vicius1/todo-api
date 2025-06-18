// UserController é a camada responsável por receber as requisições HTTP para as rotas de usuário.
// Ele extrai dados da requisição, chama os métodos apropriados do UserService e envia a resposta (seja de sucesso ou de erro)
// de volta para o cliente.
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    // Responsável por lidar com a requisição de criação de um novo usuário.
    create = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const newUser = await this.userService.create(name, email, password);

            return res.status(201).json(newUser);

        } catch (error) {
            return res.status(409).json({ message: error.message });
        }
    }

    // Responsável por lidar com a requisição de login de um usuário.
    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const result = await this.userService.login(email, password);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
}

module.exports = UserController;