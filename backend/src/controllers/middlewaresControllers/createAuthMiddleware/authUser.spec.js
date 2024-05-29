const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authUser = require('./authUser');
describe('Authentication Middleware Tests', () => {
  let req, res, user, databasePassword, password, UserPasswordModel;

  beforeEach(() => {
    user = {
      _id: '123',
      name: 'John',
      surname: 'Doe',
      role: 'user',
      email: 'john@example.com',
      photo: 'photo.jpg',
    };
    databasePassword = {
      salt: 'salt',
      password: 'hashedpassword',
    };
    password = 'password';
    UserPasswordModel = {
      findOneAndUpdate: () => ({ exec: () => null }),
    };
    req = {
      body: { remember: true },
      hostname: 'localhost',
    };
    res = {
      status: jest.fn().mockReturnThis(200),
      json: jest.fn().mockReturnThis({ success: true }),
      cookie: jest.fn().mockReturnThis(''),
    };
  });

  it('should authenticate a user with valid credentials', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('token');

    (res.status = jest.fn().mockReturnThis(200)),
      await authUser(req, res, {
        user,
        databasePassword,
        password,
        UserPasswordModel,
      });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(res.cookie).toHaveBeenCalledWith('token', 'token', expect.anything());
  });

  it('should return an error response when provided with incorrect credentials', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    res.status = jest.fn().mockReturnThis(403);

    await authUser(req, res, {
      user,
      databasePassword,
      password,
      UserPasswordModel,
    });

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('should handle exceptions during the authentication process', async () => {
    (res.status = jest.fn().mockReturnThis(403)),
      await authUser(req, res, {
        user,
        databasePassword,
        password,
        UserPasswordModel,
      });

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid credentials.' })
    );
  });
});
