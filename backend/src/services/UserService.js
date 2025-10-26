const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../utils/constants');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async createUser({ name, email, password = 'default123', bloodType, height, weight, rank, specialization }) {
    if (await this.userRepository.emailExists(email)) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { 
      name, email, password: hashedPassword, bloodType, height, weight, rank, specialization 
    };
    
    return this.userRepository.create(userData);
  }

  async createUnverifiedUser({ name, email, password, bloodType, height, weight, rank, specialization, verificationCode, codeExpiresAt }) {
    if (await this.userRepository.emailExists(email)) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { 
      name, email, password: hashedPassword, bloodType, height, weight, rank, specialization,
      emailVerified: false, verificationCode, codeExpiresAt
    };
    
    return this.userRepository.create(userData);
  }

  async verifyEmailCode(userId, code) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (user.emailVerified) {
      throw new ConflictError('Email já verificado');
    }

    if (user.verificationCode !== code) {
      throw new ConflictError('Código inválido');
    }

    if (new Date() > user.codeExpiresAt) {
      throw new ConflictError('Código expirado');
    }

    return this.userRepository.verifyEmail(userId);
  }

  async updateVerificationCode(userId, newCode, codeExpiresAt) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return this.userRepository.updateVerificationCode(userId, newCode, codeExpiresAt);
  }

  async emailExists(email) {
    return this.userRepository.emailExists(email);
  }

  async updateUser(id, { name, email }) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (await this.userRepository.emailExists(email, id)) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    return this.userRepository.update(id, { name, email });
  }

  async updatePasswordByEmail(email, newPassword) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userRepository.updatePassword(user.id, hashedPassword);
  }

  async deleteUser(id) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return true;
  }

  async updateToursCompleted(id, tours) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return this.userRepository.updateToursCompleted(id, tours);
  }

}

module.exports = UserService;