const AuthService = require('../services/AuthService');
const UserService = require('../services/UserService');
const { SUCCESS_MESSAGES, HTTP_STATUS } = require('../utils/constants');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async register(req, res, next) {
    try {
      const { name, email, password, bloodType, height, weight, rank, specialization } = req.body;
      
      // Verificar se email já existe
      if (await this.userService.emailExists(email)) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }
      
      // Criar usuário diretamente
      const user = await this.userService.createUser({ name, email, password, bloodType, height, weight, rank, specialization });
      const token = this.authService.generateToken(user.id);
      
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Cadastro realizado com sucesso! Bem-vindo à operação.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          rank: user.rank,
          emailVerified: true
        }
      });
    } catch (error) {
      next(error);
    }
  }





  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      
      // Verificar se usuário existe
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Email não encontrado' });
      }
      
      const resetCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      
      res.json({
        message: 'Código de redefinição enviado para seu email.',
        resetCode,
        user: { name: user.name, email: user.email }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, code, newPassword } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: 'Código de verificação obrigatório' });
      }
      
      await this.userService.updatePasswordByEmail(email, newPassword);
      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      res.json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;