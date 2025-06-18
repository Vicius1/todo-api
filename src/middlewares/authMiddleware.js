const jwt = require('jsonwebtoken');

// Middleware de autenticação para verificar se o usuário está autenticado
// Este middleware verifica se o token JWT está presente no cabeçalho da requisição
function authMiddleware(req, res, next) {
  // 1. Obter o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  // 2. Verificar se o token foi fornecido
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  // 3. O formato do token é "Bearer <token>". Precisamos separar as duas partes.
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  const token = parts[1];

  // 4. Verificar se o token é válido
  try {
    // jwt.verify irá checar a assinatura e a data de expiração
    // Se for válido, ele retorna o "payload" que usamos para criar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Adicionamos o ID do usuário ao objeto `req` para que as rotas
    // subsequentes saibam quem está fazendo a requisição.
    req.userId = decoded.id;

    // 6. Chama a função `next()` para permitir que a requisição continue
    return next();

  } catch (error) {
    // Se jwt.verify falhar, ele lança um erro
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;