const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');

const forgetPassword = async (req, res, { userModel }) => {
  const token = req.cookies.token;
  const { password } = req.body;
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded.forcePasswordReset) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Token invalido',
    });
  }

  const user = await User.findOne({ _id: decoded.id, removed: false });

  if (!user) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No se encontró el usuario',
    });
  }

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  const updatedUserPassword = await UserPassword.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        password: passwordHash,
        salt: salt,
      },
    },
    { new: true }
  );

  if (!updatedUserPassword) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Fallo la actualización de la contraseña',
    });
  }

  await User.findOneAndUpdate({ _id: user._id }, { $unset: { forcePasswordReset: '' } });

  return res.status(200).json({
    success: true,
    result: null,
    message: 'La contraseña se ha actualizado correctamente',
  });
};

module.exports = forgetPassword;
