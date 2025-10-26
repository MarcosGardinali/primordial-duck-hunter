const AuthController = require('../../../src/controllers/AuthController');
const AuthService = require('../../../src/services/AuthService');
const { SUCCESS_MESSAGES } = require('../../../src/utils/constants');

jest.mock('../../../src/services/AuthService');

describe('AuthController', () => {
  let authController;
  let mockAuthService;
  let req, res, next;

  beforeEach(() => {
    mockAuthService = new AuthService();
    authController = new AuthController();
    authController.authService = mockAuthService;

    req = { body: {} };
    res = {
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginData = { email: 'test@test.com', password: 'password123' };
      const authResult = {
        token: 'jwt-token',
        user: { id: 1, email: 'test@test.com' }
      };

      req.body = loginData;
      mockAuthService.login.mockResolvedValue(authResult);

      await authController.login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        ...authResult
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Login failed');
      req.body = { email: 'test@test.com', password: 'wrong' };
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});