const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../src/middleware/auth.middleware');
const { createErrorResponse } = require('../../src/utils/response.utils');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(createErrorResponse('No token, authorization denied'));
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(createErrorResponse('Token is not valid'));
  });

  it('should call next if token is valid', async () => {
    const mockUser = { id: '123', role: 'user' };
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue(mockUser);

    await authMiddleware(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
});