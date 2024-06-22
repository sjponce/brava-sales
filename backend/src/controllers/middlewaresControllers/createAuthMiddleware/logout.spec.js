const mongoose = require('mongoose');
const logout = require('./logout'); // Adjust the path as necessary

describe('logout', () => {
  let req, res, userModel, UserPasswordModel;

  beforeEach(() => {
    req = {
      cookies: { token: 'fakeToken' },
      user: { _id: 'user123' },
      hostname: 'localhost',
    };
    res = {
      clearCookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    userModel = 'User';
    UserPasswordModel = {
      findOneAndUpdate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    mongoose.model = jest.fn().mockReturnValue(UserPasswordModel);
  });

  it('should clear the "token" cookie and return a success message when a user logs out', async () => {
    await logout(req, res, { userModel });
    expect(res.clearCookie).toHaveBeenCalledWith('token', {
      maxAge: null,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      Path: '/',
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      result: {},
      message: 'Sesion cerrada',
    });
  });

  it('should handle cases where the user model does not exist or is invalid', async () => {
    mongoose.model.mockImplementation(() => {
      throw new Error('Invalid model');
    });
    await expect(logout(req, res, { userModel })).rejects.toThrow('Invalid model');
  });

  it('should correctly update the user\'s logged sessions by removing the current token', async () => {
    await logout(req, res, { userModel });
    expect(UserPasswordModel.findOneAndUpdate).toHaveBeenCalledWith(
      { user: req.user._id },
      { $pull: { loggedSessions: req.cookies.token } },
      { new: true }
    );
    expect(UserPasswordModel.exec).toHaveBeenCalled();
  });
});