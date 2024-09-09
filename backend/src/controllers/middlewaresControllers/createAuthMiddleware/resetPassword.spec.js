const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const resetPassword = require('./resetPassword');

jest.mock('bcryptjs');
jest.mock('shortid', () => ({
  generate: jest.fn().mockReturnValue('mockedSalt'),
}));

describe('resetPassword', () => {
  let req, res, userModel, User, UserPassword;

  beforeEach(() => {
    req = {
      cookies: { token: 'validToken' },
      body: { email: 'test@example.com', password: 'newPassword123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    userModel = 'User';
    User = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    UserPassword = {
      findOneAndUpdate: jest.fn(),
    };
    mongoose.model = jest.fn((modelName) => {
      if (modelName === userModel) return User;
      if (modelName === userModel + 'Password') return UserPassword;
    });
    process.env.JWT_SECRET = 'testSecret';
  });

  it('should return a 400 status code with an "Token invalido" message when the token is invalid', async () => {
    jwt.verify = jest.fn().mockReturnValue(null);

    await resetPassword(req, res, { userModel });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Token invalido',
    });
  });

  it('should return a 404 status code with a "No se encontró el usuario" message when the user is not found', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'user123' });
    User.findOne.mockResolvedValue(null);

    await resetPassword(req, res, { userModel });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No se encontró el usuario',
    });
  });

  it('should return a 500 status code with a "Fallo la actualización de la contraseña" message when password update fails', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'user123' });
    User.findOne.mockResolvedValue({ _id: 'user123' });
    bcrypt.hashSync.mockReturnValue('hashedPassword');
    UserPassword.findOneAndUpdate.mockResolvedValue(null);

    await resetPassword(req, res, { userModel });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Fallo la actualización de la contraseña',
    });
  });

  it('should return a 200 status code with a success message when password is successfully reset', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'user123' });
    User.findOne.mockResolvedValue({ _id: 'user123' });
    bcrypt.hashSync.mockReturnValue('hashedPassword');
    UserPassword.findOneAndUpdate.mockResolvedValue({ password: 'hashedPassword' });
    User.findOneAndUpdate.mockResolvedValue({});

    await resetPassword(req, res, { userModel });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: null,
      message: 'La contraseña se ha blanqueado correctamente',
    });
  });

  it('should set forcePasswordReset to true when password is successfully reset', async () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 'user123' });
    User.findOne.mockResolvedValue({ _id: 'user123' });
    bcrypt.hashSync.mockReturnValue('hashedPassword');
    UserPassword.findOneAndUpdate.mockResolvedValue({ password: 'hashedPassword' });
    User.findOneAndUpdate.mockResolvedValue({});

    await resetPassword(req, res, { userModel });

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com', removed: false },
      { $set: { forcePasswordReset: true } }
    );
  });
});
