const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const traslate = require('../../../utils/translateModel');
const { generate: uniqueId } = require('shortid');

const create = async (userModel, req, res) => {
  const User = mongoose.model(userModel);
  const UserPassword = mongoose.model(userModel + 'Password');
  const { email, password, enabled, role, ...modelData } = req.body;
  if (!email || !password || !role)
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

  let Model = '';
  if (role === 'customer' || role === 'customer') {
    Model = 'customer';
  } else if (role === 'customer') {
    Model = 'customer';
  } else {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'El rol no es valido',
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

  try {
    const cookie = `token=${req.cookies.token}`;

    const resultModel = await axios.post(
      `${process.env.BASE_API}/${Model}/create`,
      {
        ...modelData,
        user: resultUser._id,
      },
      {
        headers: {
          cookie,
        },
      }
    );

    return res.status(200).send({
      success: true,
      result: resultModel.data.result,
      message: `Usuario y ${traslate(Model)} creado correctamente`,
    });
  } catch (error) {
    await User.deleteOne({ _id: resultUser._id }).exec();
    await UserPassword.deleteOne({ user: resultUser._id }).exec();

    console.error('Error creating seller:', error);
    return res.status(403).json({
      success: false,
      result: null,
      message: 'El vendedor no pudo ser guardado',
      error: error.message,
    });
  }
};

module.exports = create;
