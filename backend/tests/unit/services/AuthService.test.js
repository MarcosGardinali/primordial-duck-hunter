const AuthService = require('../../../src/services/AuthService');
const UserRepository = require('../../../src/repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../../src/utils/errors');

jest.mock('../../../src/repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    authService = new AuthService();
    authService.userRepository = mockUserRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = { email: 'test@test.com', password: 'password123' };
      const mockUser = { 
        id: 1, 
        email: 'test@test.com', 
        password: 'hashedPassword'
      };
      const mockToken = 'mock-jwt-token';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await authService.login(loginData);

      expect(result).toEqual({
        token: mockToken,
        user: { id: 1, email: 'test@test.com' }
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });

    it('should throw UnauthorizedError when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login({ email: 'test@test.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError when password is invalid', async () => {
      const mockUser = { id: 1, password: 'hashedPassword' };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login({ email: 'test@test.com', password: 'wrongpassword' }))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token', () => {
      const userId = 1;
      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      const result = authService.generateToken(userId);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = 'valid-token';
      const decoded = { id: 1 };
      jwt.verify.mockReturnValue(decoded);

      const result = authService.verifyToken(token);

      expect(result).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    });

    it('should throw UnauthorizedError for invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken('invalid-token')).toThrow(UnauthorizedError);
    });
  });
});