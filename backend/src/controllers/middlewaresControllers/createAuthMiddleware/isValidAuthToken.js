const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const isValidAuthToken = async (req, res, next, { userModel, jwtSecret = 'JWT_SECRET' }) => {
  try {
    const UserPassword = mongoose.model(userModel + 'Password');
    const User = mongoose.model(userModel);
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No se encontro el token',
        jwtExpired: true,
      });
    const verified = jwt.verify(token, process.env[jwtSecret]);

    const userPasswordPromise = UserPassword.findOne({
      user: verified.id,
      removed: false,
    });
    const userPromise = User.findOne({ _id: verified.id, removed: false });

    const [user, userPassword] = await Promise.all([userPromise, userPasswordPromise]);

    if (!user)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'El usuario no existe, acceso denegado.',
        jwtExpired: true,
      });

    const { loggedSessions } = userPassword;
    if (!loggedSessions.includes(token)) 
      return res.status(401).json({
        success: false,
        result: null,
        message: 'El usuario no esta logueado.',
        jwtExpired: true,
      });
    else {
      const reqUserName = userModel.toLowerCase();
      req[reqUserName] = user;
      next();
    }
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      controller: 'isValidAuthToken',
    });
  }
};

module.exports = isValidAuthToken;
