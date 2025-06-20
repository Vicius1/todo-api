const jwt = require("jsonwebtoken");

// Middleware de autenticação para verificar se o usuário está autenticado
// Este middleware verifica se o token JWT está presente no cabeçalho da requisição
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    //O formato do token é "Bearer <token>". Precisamos separar as duas partes.
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Token mal formatado." });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
}

module.exports = authMiddleware;
