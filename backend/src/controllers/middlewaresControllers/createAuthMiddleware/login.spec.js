const mongoose = require('mongoose');
const Joi = require('joi');
const authUser = require('./authUser');
const login = require('./login'); // Adjust the path as necessary

describe('login', () => {
  let req, res, userModel, UserModel, UserPasswordModel;

  beforeEach(() => {
    req = {
      body: {
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    userModel = 'User';
    UserModel = {
      findOne: jest.fn(),
    };
    UserPasswordModel = {
      findOne: jest.fn(),
    };
    mongoose.model = jest.fn((modelName) => {
      if (modelName === userModel) return UserModel;
      if (modelName === userModel + 'Password') return UserPasswordModel;
    });
  });

  it('should return a 409 status code with an "Credenciales inválidas." message when the email or password is invalid or missing', async () => {
    req.body.email = 'test'; // Invalid email
    await login(req, res, { userModel });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      result: null,
      message: 'Credenciales inválidas.',
    }));
  });

  it('should return a 404 status code with a "No hay una cuenta con este mail creada." message when the email does not exist in the database', async () => {
    UserModel.findOne.mockResolvedValue(null); // Email not found
    await login(req, res, { userModel });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No hay una cuenta con este mail creada.',
    });
  });

  it('should return a 409 status code with an "El usuario no esta habilitado." message when the user is not enabled', async () => {
    const user = { _id: 'user123', enabled: false };
    UserModel.findOne.mockResolvedValue(user); // User found but not enabled
    UserPasswordModel.findOne.mockResolvedValue({}); // Password found
    await login(req, res, { userModel });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'El usuario no esta habilitado.',
    });
  });
});