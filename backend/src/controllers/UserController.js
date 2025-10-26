const UserService = require('../services/UserService');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.USER_CREATED,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  async updateTours(req, res, next) {
    try {
      await this.userService.updateToursCompleted(req.user.id, req.body.tours);
      res.json({ message: 'Tours atualizados' });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = UserController;