const authController = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('authController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create user and return token', async () => {
      const mockUser = { _id: '123' };
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fake-token');

      const req = { body: { username: 'test', password: 'pass' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.signup(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-token' });
    });

    it('should return 400 on error', async () => {
      User.create.mockRejectedValue(new Error('fail'));
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('login', () => {
    it('should return token on valid login', async () => {
      const mockUser = {
        _id: '123',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fake-token');

      const req = { body: { username: 'test', password: 'pass' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'test' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('pass');
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-token' });
    });

    it('should return 401 if user not found or password invalid', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { username: 'test', password: 'pass' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
