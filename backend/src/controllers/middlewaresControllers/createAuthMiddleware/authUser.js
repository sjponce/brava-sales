const jwt = require('jsonwebtoken');
const authUser = async (
  req,
  res,
  { user, databasePassword, password, UserPasswordModel, userEntity }
) => {
  const isMatch = databasePassword.validPassword(password);
  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Credenciales invalidas.',
    });

  if (isMatch === true) {
    const token = jwt.sign(
      {
        id: user._id,
        forcePasswordReset: user.forcePasswordReset,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? 5 * 24 + 'h' : '24h' }
    );

    await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    res
      .status(200)
      .cookie('token', token, {
        maxAge: req.body.remember ? 5 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        sameSite: 'Lax',
        httpOnly: true,
        secure: false,
        domain: req.hostname,
        path: '/',
        Partitioned: true,
      })
      .json({
        success: true,
        result: {
          _id: user._id,
          role: user.role,
          email: user.email,
          name: userEntity.name,
          surname: userEntity.surname,
          phone: userEntity.phone,
          photo: userEntity.photo,
          forcePasswordReset: user.forcePasswordReset,
        },
        message: 'Usuario autenticado.',
      });
  } else {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Credenciales invalidas.',
    });
  }
};

module.exports = authUser;
