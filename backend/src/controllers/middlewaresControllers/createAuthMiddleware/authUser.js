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
      { expiresIn: req.body.remember ? '120h' : '24h' }
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
      .cookie('token', token, (function () {
        const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
        const maxAge = req.body.remember ? 5 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const sameSite = isHttps ? 'None' : 'Lax';
        const secure = !!isHttps;
        const cookieDomain = process.env.COOKIE_DOMAIN;

        const options = {
          maxAge,
          sameSite,
          httpOnly: true,
          secure,
          path: '/',
        };

        // Only set domain if explicitly configured and not localhost
        if (cookieDomain && cookieDomain !== 'localhost') {
          options.domain = cookieDomain;
        }

        // Only set Partitioned when sent over HTTPS with SameSite=None
        if (secure && sameSite === 'None') {
          options.Partitioned = true;
        }

        return options;
      })())
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
          ...(user.role === 'customer' ? { customer: userEntity._id } : { seller: userEntity._id }),
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
