const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');
  const { email, password, enabled, name, surname, role } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      result: null,
      message: "Faltan campos obligatorios",
    });

  if (req.body.role === 'owner') {
    return res.status(403).send({
      success: false,
      result: null,
      message: "No puedes crear un usuario con el role de owner",
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

  req.body.removed = false;

  const result = await new User({
    email,
    enabled,
    name,
    surname,
    role,
  }).save();

  if (!result) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "El documento no pudo ser guardado",
    });
  }
  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    user: result._id,
    emailVerified: true,
  };
  const resultPassword = await new UserPassword(UserPasswordData).save();

  if (!resultPassword) {
    await User.deleteOne({ _id: result._id }).exec();

    return res.status(403).json({
      success: false,
      result: null,
      message: "El documento no pudo ser guardado",
    });
  }

  return res.status(200).send({
    success: true,
    result: {
      _id: result._id,
      enabled: result.enabled,
      email: result.email,
      name: result.name,
      surname: result.surname,
      photo: result.photo,
      role: result.role,
    },
    message: 'Usuario creado.',
  });
};
module.exports = create;
