const AuthService = require('../services/AuthService');
const { UnauthorizedError } = require('../utils/errors');
const prisma = require('../config/prisma');

const authService = new AuthService();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }
    
    const decoded = authService.verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado ou token inválido');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;