const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');
  const Seller = mongoose.model('Seller');
  const { email, password, enabled, role, name, surname, photo, phone } = req.body;
  if (!email || !password || !role || !name || !surname)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Faltan campos obligatorios',
    });

  if (req.body.role === 'owner') {
    return res.status(403).send({
      success: false,
      result: null,
      message: 'No puedes crear un usuario con el role de owner',
    });
  }

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El email ya esta registrado.',
    });

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      result: null,
      message: 'La contraseña debe tener al menos 8 caracteres.',
    });

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  const resultUser = await new User({
    email,
    enabled,
    role,
  }).save();

  if (!resultUser) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'El usuario no pudo ser guardado',
    });
  }

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    user: resultUser._id,
    emailVerified: true,
  };

  const resultPassword = await new UserPassword(UserPasswordData).save();

  if (!resultPassword) {
    await User.deleteOne({ _id: resultUser._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: 'El password no pudo ser guardado',
    });
  }

  const resultSeller = await new Seller({
    name,
    surname,
    user: resultUser._id,
    phone,
    photo,
  }).save();

  if (!resultSeller) {
    await User.deleteOne({ _id: resultUser._id }).exec();
    await UserPassword.deleteOne({ user: resultUser._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: 'El vendedor no pudo ser guardado',
    });
  }

  return res.status(200).send({
    success: true,
    result: { resultSeller },
    message: 'Usuario y vendedor creado',
  });
};

module.exports = create;
