const UserService = require('../../../src/services/UserService');
const UserRepository = require('../../../src/repositories/UserRepository');
const { NotFoundError, ConflictError } = require('../../../src/utils/errors');

jest.mock('../../../src/repositories/UserRepository');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    userService = new UserService();
    userService.userRepository = mockUserRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' }
      ];
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'User 1', email: 'user1@test.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { name: 'New User', email: 'new@test.com', password: 'password123' };
      const mockCreatedUser = { id: 1, ...userData };
      
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
          password: expect.any(String)
        })
      );
    });

    it('should throw ConflictError when email already exists', async () => {
      const userData = { name: 'New User', email: 'existing@test.com' };
      mockUserRepository.emailExists.mockResolvedValue(true);

      await expect(userService.createUser(userData)).rejects.toThrow(ConflictError);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateData = { name: 'Updated User', email: 'updated@test.com' };
      const existingUser = { id: userId, name: 'Old User', email: 'old@test.com' };
      const updatedUser = { id: userId, ...updateData };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(updateData.email, userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw NotFoundError when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.updateUser(999, { name: 'Test' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser(1);

      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user not found', async () => {
      mockUserRepository.delete.mockResolvedValue(false);

      await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundError);
    });
  });
});