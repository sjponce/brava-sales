const jwt = require('jsonwebtoken');
const authUser = require('./authUser'); // Adjust the path as necessary

describe('authUser', () => {
  let req, res, user, databasePassword, password, UserPasswordModel;

  beforeEach(() => {
    req = {
      body: {
        remember: false,
      },
      hostname: 'localhost',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    user = {
      _id: 'user123',
      name: 'John',
      surname: 'Doe',
      role: 'user',
      email: 'john.doe@example.com',
      phone: '1234567890',
      photo: 'photo.jpg',
    };
    databasePassword = {
      validPassword: jest.fn(),
    };
    password = 'password123';
    UserPasswordModel = {
      findOneAndUpdate: () => ({ exec: () => null }),
    };
  });

  it('should return a 403 status code with an "Credenciales invalidas." message when the password does not match the database password', async () => {
    databasePassword.validPassword.mockReturnValue(false);

    await authUser(req, res, { user, databasePassword, password, UserPasswordModel });

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Credenciales invalidas.',
    });
  });

  it('should return a 200 status code and set a cookie with a JWT token when the password matches the database password', async () => {
    databasePassword.validPassword.mockReturnValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken');

    await authUser(req, res, { user, databasePassword, password, UserPasswordModel });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith('token', 'fakeToken', {"Partitioned": true, "domain": "localhost", "httpOnly": true, "maxAge": 86400000, "path": "/", "sameSite": "Lax", "secure": false});
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      },
      message: 'Usuario autenticado.',
    });

    jwt.sign.mockRestore();
  });

  it('should correctly handle the "remember me" option by setting the token expiration and cookie maxAge accordingly', async () => {
    databasePassword.validPassword.mockReturnValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken');
    req.body.remember = true;

    await authUser(req, res, { user, databasePassword, password, UserPasswordModel });

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '120h' }
    );
    expect(res.cookie).toHaveBeenCalledWith('token', 'fakeToken', {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      sameSite: 'Lax',
      httpOnly: true,
      secure: false,
      domain: req.hostname,
      path: '/',
      Partitioned: true,
    });

    jwt.sign.mockRestore();
  });
});