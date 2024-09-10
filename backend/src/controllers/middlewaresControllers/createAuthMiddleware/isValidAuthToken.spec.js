const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const isValidAuthToken = require('./isValidAuthToken');

describe('isValidAuthToken', () => {
  let req, res, next, userModel, jwtSecret, UserPasswordModel, UserModel;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    userModel = 'User';
    jwtSecret = 'JWT_SECRET';
    UserPasswordModel = {
      findOne: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    UserModel = {
      findOne: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    mongoose.model = jest.fn((modelName) => {
      if (modelName === userModel + 'Password') return UserPasswordModel;
      if (modelName === userModel) return UserModel;
    });
  });

  it('should return a 401 status code with a "No se encontro el token" message when the token is not present in the request cookies', async () => {
    await isValidAuthToken(req, res, next, { userModel, jwtSecret });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontro el token',
      jwtExpired: true,
    });
  });

  it('should return a 503 status code with a "No se pudo verificar el token, acceso denegado." message when the token verification fails', async () => {
    req.cookies.token = 'invalidToken';
    const err = new Error('Invalid token');
    jest.spyOn(jwt, 'verify').mockImplementation(() => { throw err; });
    
    await isValidAuthToken(req, res, next, { userModel, jwtSecret });

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        result: null,
        error: err,
        message: "Invalid token",
        controller: 'isValidAuthToken',
      });

    jwt.verify.mockRestore();
  });

  it('should return a 401 status code with a "El usuario no esta logueado." message when the token is not found in the user\'s logged sessions', async () => {
    req.cookies.token = 'validToken';
    const verified = { id: 'user123' };
    jest.spyOn(jwt, 'verify').mockReturnValue(verified);

    UserPasswordModel.findOne.mockResolvedValueOnce({ loggedSessions: [] }),
    UserModel.findOne.mockResolvedValueOnce({ _id: 'user123' }),

    await isValidAuthToken(req, res, next, { userModel, jwtSecret });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El usuario no esta logueado.',
      jwtExpired: true,
    });

    jwt.verify.mockRestore();
  });
});