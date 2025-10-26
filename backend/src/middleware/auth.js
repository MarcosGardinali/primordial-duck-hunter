const AuthService = require('../services/AuthService');
const { UnauthorizedError } = require('../utils/errors');

const authService = new AuthService();

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }
    
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;