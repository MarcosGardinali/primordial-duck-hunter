const UserController = require('../../../src/controllers/UserController');
const UserService = require('../../../src/services/UserService');
const { HTTP_STATUS } = require('../../../src/utils/constants');

jest.mock('../../../src/services/UserService');

describe('UserController', () => {
  let userController;
  let mockUserService;
  let req, res, next;

  beforeEach(() => {
    mockUserService = new UserService();
    userController = new UserController();
    userController.userService = mockUserService;

    req = { params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, name: 'User 1' }];
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAll(req, res, next);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Service error');
      mockUserService.getAllUsers.mockRejectedValue(error);

      await userController.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const userData = { name: 'New User', email: 'new@test.com' };
      const createdUser = { id: 1, ...userData };
      
      req.body = userData;
      mockUserService.createUser.mockResolvedValue(createdUser);

      await userController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário criado com sucesso',
        user: createdUser
      });
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      req.params.id = '1';
      mockUserService.deleteUser.mockResolvedValue(true);

      await userController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });
  });
});