// UserController é a camada responsável por receber as requisições HTTP para as rotas de usuário.
// Ele extrai dados da requisição, chama os métodos apropriados do UserService e envia a resposta (seja de sucesso ou de erro)
// de volta para o cliente.
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    // Responsável por lidar com a requisição de criação de um novo usuário.
    create = async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "O formato do e-mail é inválido." });
        }

        try {
            const newUser = await this.userService.create(
                name,
                email,
                password
            );

            return res.status(201).json(newUser);
        } catch (error) {
            if (error.message.includes("Este e-mail já está em uso.")) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Ocorreu um erro interno ao criar o usuário." });
        }
    };

    // Responsável por lidar com a requisição de login de um usuário.
    login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
        }

        try {
            const result = await this.userService.login(email, password);

            return res.status(200).json(result);
        } catch (error) {
            if (error.message.includes("Credenciais inválidas")) {
                return res.status(401).json({ message: error.message });
            }
            return res.status(500).json({ message: "Ocorreu um erro interno ao realizar o login." });
        }
    };
}

module.exports = UserController;
