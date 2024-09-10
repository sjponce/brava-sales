const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');


const resetPassword = async (req, res, { userModel }) => {
  const token = req.cookies.token;
  const { email, password } = req.body;
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Token invalido',
    });
  }

  const user = await User.findOne({ email, removed: false });

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

  await User.findOneAndUpdate({ email, removed: false }, { $set: { forcePasswordReset: true } });

  return res.status(200).json({
    success: true,
    result: null,
    message: 'La contraseña se ha blanqueado correctamente',
  });
};

module.exports = resetPassword;
