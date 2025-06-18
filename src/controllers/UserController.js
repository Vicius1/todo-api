class UserController {
    // Recebe uma instância do nosso UserService
    constructor(userService) {
        this.userService = userService;
    }

    // Métodos do controller são responsáveis por receber as requisições HTTP,
    // chamar os métodos do service e retornar as respostas HTTP.
    create = async (req, res) => {
        try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Chama o método create do UserService
        const newUser = await this.userService.create(name, email, password);

        return res.status(201).json(newUser);

        } catch (error) {
        // 409 Conflict é um bom status para recursos duplicados
        return res.status(409).json({ message: error.message });
        }
    }

    // Se a senha for válida, geramos um token JWT
    //         return { user, token };
    login = async (req, res) => {
        try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Chama o método login do UserService
        const result = await this.userService.login(email, password);

        return res.status(200).json(result); // 200 OK

        } catch (error) {
        // O service lança "Credenciais inválidas", então o controller retorna 401 Unauthorized
        return res.status(401).json({ message: error.message });
        }
    }
}

module.exports = UserController;